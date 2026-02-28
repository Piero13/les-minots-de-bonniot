import { useEffect, useState } from "react";
import { Container, ListGroup, Spinner } from "react-bootstrap";
import { supabase } from "../services/supabaseClient";

const LegalDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data, error } = await supabase
        .from("legal_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setDocs(data);
      setLoading(false);
    };

    fetchDocs();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-4">
      <h2 className="fs-4 fs-lg-3 text-center text-md-start">Documents légaux</h2>
      <ListGroup className="mt-3">
        {docs.map((doc) => (
          <ListGroup.Item key={doc.id}>
            <a
              href={
                supabase.storage
                  .from("legal-docs-bucket")
                  .getPublicUrl(doc.file_path).data.publicUrl
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc.title}
            </a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default LegalDocuments;