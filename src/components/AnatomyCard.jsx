import { useState } from "react";
import { Link } from "react-router-dom";

function AnatomyCard({ model, isFavourite, onFavourite }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="anatomy-card">
      <div className="card-media">
        {model.previewImage && !imgError ? (
          <img
            src={model.previewImage}
            alt={`Illustrated anatomy preview for ${model.name}`}
            className="model-preview-image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="model-symbol" aria-hidden="true">
            {model.icon}
          </div>
        )}
        <span className="media-badge">{model.category}</span>
      </div>
      <div className="card-content">
        <p className="card-category">{model.category}</p>
        <h3>{model.name}</h3>
        <p>{model.description}</p>
        <p className="structure-count">
          {Object.values(model.structureGroups).flat().length} study points
        </p>
        <div className="card-actions">
          <Link className="button button-small" to={`/anatomy/${model.id}`}>
            View 3D model
          </Link>
          <button
            className="favourite-button"
            onClick={() => onFavourite(model.id)}
            aria-label={`${isFavourite ? "Remove" : "Add"} ${model.name} favourite`}
          >
            {isFavourite ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default AnatomyCard;
