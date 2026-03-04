import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Policy = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    <Card className="bs-primaryDark border border-primary">
                        <Card.Body>
                            <h2 className="mb-4 text-center fs-4 fs-md-3">
                                Politique de Confidentialité
                            </h2>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4">Collecte des données</h3>
                                <p>
                                Nous collectons uniquement les informations nécessaires :
                                </p>
                                <ul>
                                <li>Nom et prénom</li>
                                <li>Adresse email</li>
                                <li>Informations d’adhésion</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4">Finalité du traitement</h3>
                                <p>
                                    Les données sont utilisées pour :
                                </p>
                                <ul>
                                <li>Gérer les adhésions</li>
                                <li>Communiquer les informations de l’association</li>
                                <li>Organiser des événements</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4">Base légale</h3>
                                <p>
                                    Le traitement repose sur le consentement de l’utilisateur ou l’intérêt légitime de l’association.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4">Durée de conservation</h3>
                                <p>
                                    Les données sont conservées uniquement le temps nécessaire à la gestion de l’association.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h3 className="fs-5 fs-md-4">Droits des utilisateurs</h3>
                                <p>
                                    Conformément au RGPD, vous disposez des droits d’accès, de rectification, de suppression et d’opposition.
                                </p>
                                <p>
                                Contact : pf.devweb13@gmail.com
                                </p>
                            </section>

                            <section>
                                <h3 className="fs-5 fs-md-4">Cookies</h3>
                                <p>
                                    Le site peut utiliser des cookies techniques nécessaires au bon fonctionnement. Aucun cookie publicitaire n’est utilisé.
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

export default Policy;