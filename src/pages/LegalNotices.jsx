import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const LegalNotices = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card className="border border-primary bs-primaryDark">
                        <Card.Body>
                            <h2 className="mb-4 text-center fs-4 fs-lg-3">Mentions Légales</h2>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4 text-center text-md-start">Éditeur du site</h3>
                                <p>
                                <strong>Association :</strong> APE Saint Julien 1
                                <br />
                                <strong>Forme juridique :</strong> Association loi 1901
                                <br />
                                <strong>Adresse :</strong> 67 Avenue Fernandel, 13012 Marseille
                                <br />
                                <strong>Email :</strong> saintjulien1.ape@gmail.com
                                <br />
                                <strong>Téléphone :</strong> 06.19.97.25.43
                                <br />
                                <strong>SIREN :</strong> W.133.00.55.23
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4 text-center text-md-start">Directeur de la publication </h3>
                                <p>
                                    Mme HANOUNOU Sylvia
                                    <br />
                                    Email : sylviahanounou484@gmail.com
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4 text-center text-md-start">Administrateur du site</h3>
                                <p>
                                    M FASCE Pierre
                                    <br />
                                    Email : pf.devweb13@gmail.com
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4 text-center text-md-start">Hébergement</h3>
                                <p>
                                <strong>Hébergeur :</strong> Netlify, Inc.
                                <br />
                                <strong>Adresse :</strong> 2325 3rd Street, Suite 296, San Francisco, California 94107, U.S.A.
                                <br />
                                <strong>Site web :</strong> https://www.netlify.com
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4 text-center text-md-start">Propriété intellectuelle</h3>
                                <p>
                                    Les contenus du site (textes, images, documents) sont la propriété exclusive de l’association, sauf mention contraire. Toute reproduction sans autorisation est interdite.
                                </p>
                            </section>

                            <section>
                                <h3 className="fs-5 fs-md-4 text-center text-md-start">Responsabilité</h3>
                                <p>
                                    L’association s’efforce de fournir des informations à jour. Toutefois elle ne saurait être tenue responsable d’erreurs ou omissions.
                                </p>
                            </section>

                            <div className="d-flex flex-row justify-content-center my-3">
                                <Button
                                    variant="primary"
                                    href="/"
                                    className="border border-customDark bs-darkShadow text-customLight"
                                >
                                    Page d'accueil
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LegalNotices;