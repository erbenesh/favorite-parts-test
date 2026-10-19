function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="alert alert-danger mt-3 mb-0" role="alert">
      {message}
    </div>
  );
}

export default ErrorAlert;
