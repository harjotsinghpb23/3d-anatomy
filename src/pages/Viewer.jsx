import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import models from "../data/models.json";

function Viewer() {
  const { id } = useParams();
  const model = models.find((item) => item.id === id);
  const [localModelFailed, setLocalModelFailed] = useState(false);

  if (!model) {
    return (
      <div className="container access-message">
        <h1>Model not found</h1>
        <p>The requested anatomy structure was not found in the catalogue.</p>
        <Link className="button" to="/anatomy">
          Back to anatomy catalogue
        </Link>
      </div>
    );
  }

  const isLocalModel = Boolean(model.localFile) && !localModelFailed;
  const hasExternalViewer = Boolean(model.viewerId);
  const viewerUrl = `/v2/viewer.html?uid=${model.viewerId}&name=${encodeURIComponent(
    model.name
  )}&author=${encodeURIComponent(model.author)}`;

  return (
    <div className="container viewer-page">
      <Link className="back-link" to="/anatomy">
        ← Back to anatomy catalogue
      </Link>

      <div className="page-heading">
        <div>
          <p className="eyebrow">3D Interactive Anatomy Viewer</p>
          <h1>{model.name}</h1>
        </div>
        <div className="model-meta-badge">
          <span className="badge-category">{model.category}</span>
          {model.license && <span className="badge-license">{model.license}</span>}
        </div>
      </div>

      <p className="viewer-description">{model.description}</p>

      {/* Viewer Container */}
      <div className="viewer-container-wrapper" role="region" aria-label={`3D view of ${model.name}`}>
        {isLocalModel ? (
          <model-viewer
            className="local-viewer"
            src={model.localFile}
            alt={`3D interactive anatomical model of ${model.name}`}
            aria-label={`Interactive 3D model of ${model.name}`}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            tabIndex={0}
            onError={() => setLocalModelFailed(true)}
          >
            <div slot="progress-bar" className="viewer-loading-slot">
              Loading 3D anatomy mesh...
            </div>
          </model-viewer>
        ) : hasExternalViewer ? (
          <iframe
            className="external-viewer"
            title={`${model.name} 3D interactive model`}
            src={viewerUrl}
            tabIndex={0}
            allow="autoplay; fullscreen; xr-spatial-tracking"
          ></iframe>
        ) : (
          <div className="model-unavailable">
            <h2>Dedicated 3D Model Unavailable</h2>
            <p>
              A verified open-license 3D model for this structure is currently not embedded.
              Detailed anatomical study points are listed below.
            </p>
          </div>
        )}

        <div className="viewer-controls-bar">
          <p className="viewer-instructions">
            💡 <strong>Controls:</strong> Left-click / Drag to rotate · Scroll / Pinch to zoom · Right-click to pan
          </p>
          <div className="viewer-attribution-tag">
            <span>Author: {model.author}</span>
            {model.sourceUrl && (
              <>
                {" · "}
                <a
                  href={model.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-credit-link"
                >
                 
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Study Guide */}
      <section className="structure-panel" aria-labelledby="structure-title">
        <h2 id="structure-title">Detailed Study Guide: {model.name}</h2>
        <div className="structure-groups-grid">
          {Object.entries(model.structureGroups).map(([groupName, structures]) => (
            <div className="structure-group" key={groupName}>
              <h3>{groupName}</h3>
              <ul>
                {structures.map((structure) => (
                  <li key={structure}>{structure}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Labelled Skeletal Diagram — only for Full Body model */}
      {model.id === "body" && (
        <section className="skeletal-diagram-section" aria-labelledby="skeletal-diagram-title">
          <h2 id="skeletal-diagram-title">🦴 Labelled Skeletal Anatomy Diagram</h2>
          <p className="skeletal-diagram-caption">
            Complete human skeletal system with all major bones identified and labelled.
            Use this reference diagram alongside the 3D model for a deeper understanding of bone structure and positioning.
          </p>
          <div className="skeletal-diagram-wrapper">
            <img
              src="/previews/skeletal_labelled.jpg"
              alt="Complete human skeletal system with labelled bones including skull, clavicle, sternum, humerus, radius, ulna, ribs, vertebrae, pelvis, femur, tibia, fibula, carpals, tarsals and phalanges"
              className="skeletal-diagram-img"
            />
          </div>
          <p className="skeletal-diagram-note">
            📚 <strong>206 bones</strong> in the adult human skeleton · Axial skeleton (80 bones) + Appendicular skeleton (126 bones)
          </p>
        </section>
      )}

      <p className="viewer-note">
        {isLocalModel
          ? "✓ Loaded from verified local glTF/GLB asset."
          : hasExternalViewer
          ? "✓ Loaded from verified open-access Open Anatomy model (CC-BY-4.0)."
          : "ℹ Study references provided."}
      </p>
    </div>
  );
}

export default Viewer;
