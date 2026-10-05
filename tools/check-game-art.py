"""Dependency-free pixel checks for the rectangle/polygon SVG game fixtures.

Run: python tools/check-game-art.py --preview PATH.png
This tiny fixture rasterizer supports M/L/H/V/Z paths, not arbitrary SVGs.
The browser remains the production renderer.
"""
import argparse
import json
import re
import struct
import zlib
from pathlib import Path
from xml.etree import ElementTree as ET

ASSETS = Path(__file__).resolve().parents[1] / "public" / "game-assets"
ATLAS = json.loads((ASSETS / "atlas.json").read_text(encoding="utf-8"))


def polygons(path):
    tokens = re.findall(r"[a-zA-Z]|-?\d+(?:\.\d+)?", path)
    x = y = 0
    points = []
    i = 0
    while i < len(tokens):
        command = tokens[i]
        i += 1
        relative = command.islower()
        if command.upper() == "Z":
            yield points
            x, y = points[0]
            points = []
            continue
        if command.upper() in ("M", "L"):
            a, b = float(tokens[i]), float(tokens[i + 1])
            i += 2
            x, y = (x + a, y + b) if relative else (a, b)
        elif command.upper() == "H":
            a = float(tokens[i])
            i += 1
            x = x + a if relative else a
        elif command.upper() == "V":
            a = float(tokens[i])
            i += 1
            y = y + a if relative else a
        else:
            raise AssertionError(f"Unsupported fixture path command: {command}")
        points.append((x, y))
    if points:
        yield points


def inside(x, y, points):
    result = False
    for (ax, ay), (bx, by) in zip(points, points[1:] + points[:1]):
        if (ay > y) != (by > y) and x < (bx - ax) * (y - ay) / (by - ay) + ax:
            result = not result
    return result


def texture(name):
    entry = ATLAS["frames"][name]
    frame = entry["frame"]
    root = ET.parse(ASSETS / entry.get("image", "atlas.svg")).getroot()
    pixels = [[(0, 0, 0, 0) for _ in range(frame["w"])] for _ in range(frame["h"])]
    # Each checked texture occupies one top-level translated group.
    for group in root:
        translation = re.findall(r"-?\d+", group.get("transform", "translate(0 0)"))
        gx, gy = map(int, translation[:2])
        if (gx, gy) != (frame["x"], frame["y"]):
            continue
        for shape in group:
            tag = shape.tag.split("}")[-1]
            fill = shape.get("fill", "#000000").lstrip("#")
            color = tuple(int(fill[i:i + 2], 16) for i in (0, 2, 4)) + (255,)
            if tag == "rect":
                x, y, w, h = (float(shape.get(k, "0")) for k in ("x", "y", "width", "height"))
                outlines = [[(x, y), (x + w, y), (x + w, y + h), (x, y + h)]]
            elif tag == "path":
                outlines = list(polygons(shape.attrib["d"]))
            else:
                raise AssertionError(f"Unsupported fixture shape: {tag}")
            for outline in outlines:
                for y in range(frame["h"]):
                    for x in range(frame["w"]):
                        if inside(x + .5, y + .5, outline):
                            pixels[y][x] = color
    return pixels


def flip(pixels, x=False, y=False):
    rows = list(reversed(pixels)) if y else pixels
    return [list(reversed(row)) if x else list(row) for row in rows]


def png(path, pixels):
    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))
    width, height = len(pixels[0]), len(pixels)
    raw = b"".join(b"\x00" + bytes(channel for pixel in row for channel in pixel) for row in pixels)
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">2I5B", width, height, 8, 6, 0, 0, 0))
                     + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--preview", type=Path)
    args = parser.parse_args()
    grass = texture("grass")
    base = grass[0][0]
    assert all(pixel == base for pixel in grass[0] + grass[-1])
    assert all(row[0] == base and row[-1] == base for row in grass)
    assert sum(pixel == base for row in grass for pixel in row) > 32 * 32 * .8
    assert all(pixel[3] == 255 for row in grass for pixel in row)
    print("PASS grass: opaque, matching edges, no dark border")
    sprites = {name: texture(name) for name in ("player", "slime-blue", "slime-red", "chest")}
    for name, pixels in sprites.items():
        assert any(pixel[3] for row in pixels for pixel in row)
        for x, y in ((True, False), (False, True), (True, True)):
            assert flip(flip(pixels, x, y), x, y) == pixels
            assert sorted(pixel for row in pixels for pixel in row) == sorted(pixel for row in flip(pixels, x, y) for pixel in row)
        print(f"PASS {name}: both flips preserve pixels and transparency")
    if args.preview:
        preview = [[base for _ in range(384)] for _ in range(352)]
        for row in range(11):
            for column in range(12):
                variant = (column * 31 + row * 17 + column * row * 7) & 3
                tile = flip(grass, bool(variant & 1), bool(variant & 2))
                for y in range(32):
                    preview[row * 32 + y][column * 32:(column + 1) * 32] = tile[y]
        for index, pixels in enumerate(sprites.values()):
            for variant, (fx, fy) in enumerate(((False, False), (True, False), (False, True), (True, True))):
                for y, line in enumerate(flip(pixels, fx, fy)):
                    for x, pixel in enumerate(line):
                        if pixel[3]:
                            preview[32 + index * 80 + y][32 + variant * 80 + x] = pixel
        # 2x nearest-neighbour zoom for visual inspection.
        enlarged = [sum(([pixel] * 2 for pixel in row), []) for row in preview for _ in range(2)]
        png(args.preview, enlarged)
        print(f"Preview: {args.preview}")


if __name__ == "__main__":
    main()
