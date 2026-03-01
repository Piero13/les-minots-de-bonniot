import { useEffect, useState } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../services/supabaseClient";
import {
  getLegalDocs,
  addLegalDoc,
  deleteLegalDoc
} from "../../services/legalDocsService";

const ManageLegalDocs = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await getLegalDocs();
      setDocs(data);
    } catch (error) {
      setError("Erreur chargement documents : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const cleanFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // supprime accents
        .replace(/\s+/g, "-")            // espaces -> tirets
        .replace(/[^a-zA-Z0-9.-]/g, ""); // caractères spéciaux
      const fileName = `legal/${Date.now()}_${cleanFileName}`;
      const filePath = `legal/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("legal-docs-bucket")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      await addLegalDoc({
        title,
        file_path: filePath
      });

      setTitle("");
      setFile(null);
      setError(null);
      await loadDocs();
    } catch (err) {
      console.error(err);
      setError("Impossible d'uploader le document");
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm("Supprimer ce document ?")) return;

    try {
      await supabase.storage
        .from("legal-docs-bucket")
        .remove([doc.file_path]);

      await deleteLegalDoc(doc.id);
      await loadDocs();
    } catch (error) {
      setError("Erreur suppression document : ", error);
    }
  };

  return (
    <div className="pb-5 px-4">
      <h2 className="fs-4 fs-md-3 mb-3">Documents légaux</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleUpload} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Titre</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Fichier (PDF recommandé)</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-center justify-content-lg-start">
            <Button type="submit" className="mb-5 border border-customDark bs-primaryDark text-customLight">Upload document</Button>
        </div>
        
      </Form>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="fs-7 fs-md-6">Titre</th>
              <th className="fs-7 fs-md-6">Date</th>
              <th className="fs-7 fs-md-6">Télécharger</th>
              <th className="fs-7 fs-md-6">Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.title}</td>
                <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                <td>
                  <a
                    href={
                      supabase.storage
                        .from("legal-docs-bucket")
                        .getPublicUrl(doc.file_path).data.publicUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Télécharger
                  </a>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(doc)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ManageLegalDocs;