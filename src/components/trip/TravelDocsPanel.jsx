import { useState } from 'react';
import { useTrip } from '../../context/TripContext.jsx';

const emptyForm = {
  title: '',
  type: 'text',
  text: ''
};

const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

function formatFileSize(bytes = 0) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function typeLabel(type) {
  switch (type) {
    case 'pdf':
      return 'PDF';
    case 'image':
      return 'Immagine / QR';
    case 'email':
      return 'Email / conferma';
    case 'ticket':
      return 'Biglietto / prenotazione';
    default:
      return 'Documento';
  }
}

function typeCode(type) {
  switch (type) {
    case 'pdf':
      return 'PDF';
    case 'image':
      return 'IMAGE';
    case 'email':
      return 'EMAIL';
    case 'ticket':
      return 'TICKET';
    default:
      return 'DOC';
  }
}

function detectDocType(selectedType, file) {
  if (selectedType !== 'text') {
    return selectedType;
  }

  if (!file) {
    return 'text';
  }

  if (file.type === 'application/pdf') {
    return 'pdf';
  }

  if (file.type.startsWith('image/')) {
    return 'image';
  }

  return 'text';
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Errore lettura file'));

    reader.readAsDataURL(file);
  });
}

function DocumentTypeIcon({ type }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: 18,
    height: 18
  };

  if (type === 'pdf') {
    return (
      <svg {...commonProps}>
        <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2z" />
        <path d="M14 2v6h6" />
        <path d="M8 15h8M8 11h3M8 19h6" />
      </svg>
    );
  }

  if (type === 'image') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="M21 16l-5-5-7 7" />
      </svg>
    );
  }

  if (type === 'email') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    );
  }

  if (type === 'ticket') {
    return (
      <svg {...commonProps}>
        <path d="M7 7h10a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9a2 2 0 0 1 2-2z" />
        <path d="M12 8v8" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function SmallFileIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function SmallTagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 13l-7 7-9-9V4h7l9 9z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function SmallTextIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

function DocDetailRow({ icon, label, value }) {
  if (!value) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '14px auto 1fr',
        gap: 8,
        alignItems: 'start',
        fontSize: 12,
        lineHeight: 1.45,
        color: 'var(--text)'
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted)',
          marginTop: 1
        }}
      >
        {icon}
      </span>

      <span
        style={{
          fontWeight: 700,
          color: 'var(--muted)',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}

function TravelDocCard({ doc, mode, onRemove }) {
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const hasText = Boolean(doc.text?.trim());
  const hasFile = Boolean(doc.fileDataUrl);
  const hasImage = Boolean(doc.fileDataUrl && doc.fileType?.startsWith('image/'));
  const hasFileName = Boolean(doc.fileName);
  const hasFileType = Boolean(doc.fileType);
  const hasFileSize = Boolean(doc.fileSize);

  const textPreviewStyle = isTextExpanded
    ? {
        whiteSpace: 'pre-wrap'
      }
    : {
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap'
      };

  return (
    <article
      className="booking-card"
      style={{
        borderRadius: 22,
        padding: 14,
        boxShadow: 'var(--shadow)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '34px minmax(0, 1fr) auto',
          gap: 12,
          alignItems: 'start'
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            background: '#f2eee7',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#665f51',
            flexShrink: 0
          }}
        >
          <DocumentTypeIcon type={doc.type} />
        </div>

        <div style={{ minWidth: 0 }}>
          <strong
            style={{
              display: 'block',
              fontSize: 18,
              lineHeight: 1.2,
              color: '#1f2937',
              fontWeight: 800
            }}
          >
            {doc.title || 'Documento viaggio'}
          </strong>

          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: 'var(--muted)'
            }}
          >
            {typeCode(doc.type)}
          </div>
        </div>

        {mode === 'organizer' ? (
          <button type="button" className="mini-button danger" onClick={() => onRemove(doc.id)}>
            Elimina
          </button>
        ) : (
          <div />
        )}
      </div>

      {(hasFileName || hasFileType || hasFileSize || hasText) && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: '#faf8f5',
            border: '1px solid var(--border)',
            borderRadius: 14,
            display: 'grid',
            gap: 8
          }}
        >
          <DocDetailRow icon={<SmallTagIcon />} label="Tipo:" value={typeLabel(doc.type)} />
          <DocDetailRow icon={<SmallFileIcon />} label="File:" value={doc.fileName} />
          <DocDetailRow icon={<SmallFileIcon />} label="Formato:" value={doc.fileType} />
          <DocDetailRow
            icon={<SmallFileIcon />}
            label="Dimensione:"
            value={formatFileSize(doc.fileSize)}
          />

          {hasText ? (
            <div
              style={{
                marginTop: 2,
                paddingTop: 8,
                borderTop: '1px solid #e8e1d8'
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '14px auto 1fr',
                  gap: 8,
                  alignItems: 'start'
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                    marginTop: 1
                  }}
                >
                  <SmallTextIcon />
                </span>

                <span
                  style={{
                    fontWeight: 700,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                    fontSize: 12
                  }}
                >
                  Testo:
                </span>

                <div>
                  <div
                    style={{
                      fontSize: 10.5,
                      lineHeight: 1.5,
                      color: '#8b857b',
                      fontStyle: 'italic',
                      ...textPreviewStyle
                    }}
                  >
                    {doc.text}
                  </div>

                  {doc.text.length > 220 ? (
                    <button
                      type="button"
                      className="ghost-button"
                      style={{ marginTop: 10 }}
                      onClick={() => setIsTextExpanded((prev) => !prev)}
                    >
                      {isTextExpanded ? 'Nascondi testo' : 'Mostra testo'}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {hasImage ? (
        <div style={{ marginTop: 12 }}>
          <img
            src={doc.fileDataUrl}
            alt={doc.title || 'Documento immagine'}
            style={{
              width: '100%',
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: '#fff'
            }}
          />
        </div>
      ) : null}

      {hasFile ? (
        <div style={{ marginTop: 12 }}>
          <a
            href={doc.fileDataUrl}
            download={doc.fileName || 'documento'}
            className="ghost-button button-link"
          >
            Apri / scarica file
          </a>
        </div>
      ) : null}
    </article>
  );
}

function TravelDocsPanel() {
  const { trip, mode, addTravelDoc, removeTravelDoc } = useTrip();
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() && !form.text.trim() && !selectedFile) {
      window.alert('Inserisci almeno un titolo, un testo o un file.');
      return;
    }

    setIsSaving(true);

    try {
      let fileDataUrl = '';
      let fileName = '';
      let fileType = '';
      let fileSize = 0;

      if (selectedFile) {
        if (selectedFile.size > MAX_FILE_SIZE) {
          window.alert(
            'Il file è troppo grande per il salvataggio locale dell’app. Prova con un PDF o un’immagine più leggeri.'
          );
          setIsSaving(false);
          return;
        }

        fileDataUrl = await readFileAsDataUrl(selectedFile);
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        fileSize = selectedFile.size;
      }

      addTravelDoc({
        title: form.title.trim() || fileName || 'Documento viaggio',
        type: detectDocType(form.type, selectedFile),
        text: form.text.trim(),
        fileName,
        fileType,
        fileSize,
        fileDataUrl
      });

      setForm(emptyForm);
      setSelectedFile(null);

      const fileInput = document.getElementById('travel-doc-file-input');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      window.alert('Non sono riuscito a importare il file.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="page-section">
      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h2 className="section-title">Documenti viaggio</h2>
            <p className="section-subtitle">
              Salva testi incollati, PDF, immagini e QR code dentro il viaggio.
            </p>
          </div>
        </div>

        {mode === 'organizer' && (
          <form className="editor-card no-shadow" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="wide">
                <span>Titolo documento</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Es. Booking hotel Siviglia"
                />
              </label>

              <label>
                <span>Tipo</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="text">Documento / testo</option>
                  <option value="email">Email / conferma</option>
                  <option value="ticket">Biglietto / prenotazione</option>
                  <option value="pdf">PDF</option>
                  <option value="image">Immagine / QR</option>
                </select>
              </label>

              <label>
                <span>Carica file</span>
                <input
                  id="travel-doc-file-input"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </label>

              <label className="wide">
                <span>Testo incollato</span>
                <textarea
                  rows="6"
                  value={form.text}
                  onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Incolla qui email, dettagli di prenotazione, codici, note o testo utile."
                />
              </label>
            </div>

            <div className="inline-actions">
              <button type="submit" className="primary-button" disabled={isSaving}>
                {isSaving ? 'Importazione...' : 'Salva documento'}
              </button>
            </div>

            <p className="muted-text" style={{ marginTop: 10 }}>
              Nota: per ora conviene caricare file piccoli. PDF o immagini molto pesanti possono
              non entrare nel salvataggio locale.
            </p>
          </form>
        )}
      </section>

      <section className="panel-card">
        <div className="panel-card__header">
          <div>
            <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1.1 }}>Documenti salvati</h3>
            <p className="section-subtitle">
              {trip.travelDocs?.length || 0} elemento{trip.travelDocs?.length === 1 ? '' : 'i'}
            </p>
          </div>
        </div>

        <div className="stack">
          {!trip.travelDocs?.length ? (
            <p className="muted-text">Nessun documento salvato per questo viaggio.</p>
          ) : (
            trip.travelDocs.map((doc) => (
              <TravelDocCard key={doc.id} doc={doc} mode={mode} onRemove={removeTravelDoc} />
            ))
          )}
        </div>
      </section>
    </section>
  );
}

export default TravelDocsPanel;