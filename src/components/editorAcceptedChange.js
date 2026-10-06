export function acceptEditorChange(change, reportError, rollback = () => {}) {
  try {
    change();
    reportError('');
    return true;
  } catch (error) {
    reportError(error.message || 'Nie można zapisać zmiany.');
    rollback();
    return false;
  }
}
