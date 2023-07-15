export default function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>⛔{message}</span>
    </div>
  );
}
