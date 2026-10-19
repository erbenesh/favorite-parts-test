function SkeletonList({ rows = 4 }) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-line skeleton-line--lg" />
          <div className="skeleton-line skeleton-line--md" />
          <div className="skeleton-meta">
            <div className="skeleton-line skeleton-line--sm" />
            <div className="skeleton-line skeleton-line--sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonList;
