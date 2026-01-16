/**
 * Recovery System (Player / Dev Snapshots)
 */
export function loadSnapshot(snapshot) {
  try {
    return JSON.parse(localStorage.getItem(snapshot));
  } catch (err) {
    console.error('Failed to load snapshot', err);
    return null;
  }
}

export function saveSnapshot(id, data) {
  try {
    localStorage.setItem(id, JSON.stringify(data));
    console.log(`Snapshot saved: ${id}`);
  } catch (err) {
    console.error('Failed to save snapshot', err);
  }
}
