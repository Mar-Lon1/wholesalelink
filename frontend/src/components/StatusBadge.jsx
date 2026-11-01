export default function StatusBadge({ status }) {
  return <span className={`status-${status}`}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>;
}
