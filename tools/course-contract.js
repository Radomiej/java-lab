// TeaVM's in-memory javac requires flat filenames. Give each independent
// exercise unique student class names rather than introducing source folders.
export function buildGameCourseContract(tasks,engineFiles) {
  const files={...engineFiles},calls=[];
  for(const [index,task] of tasks.entries()) {
    const sources=Object.fromEntries(Object.entries({...task.solutionFiles,...task.javaTestFiles}).filter(([name])=>name.endsWith('.java')));
    const names=Object.keys(sources).map(file=>file.replace(/\.java$/,''));
    const pattern=new RegExp(`\\b(${names.join('|')})\\b`,'g');
    for(const [name,source] of Object.entries(sources))
      files[`Case${index}${name}`]=`import engine.*;\n${source.replace(pattern,word=>`Case${index}${word}`)}`;
    calls.push(`Case${index}JavaTest.main(args); System.out.println("PASS ${task.id}");`);
  }
  files['CourseMain.java']=`public class CourseMain { public static void main(String[] args) { ${calls.join('\n')} } }`;
  return {files,mainClass:'CourseMain',mode:'console'};
}
