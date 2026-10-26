# Paw Haven — Animal Adoption Management

SAP CAP (Node.js) backend with SAP Fiori applications, SAP HANA Cloud persistence, and SAP BTP-managed access.

## Project layout

- `app/` — Fiori UI5 applications (landing page, admin and user dashboards, workflow, health management, inspection management)
- `db/` — CAP data model and CSV seed data
- `srv/` — CAP services and business logic
- `approuter/` — SAP BTP application-router configuration
- `mta.yaml` — Cloud Foundry deployment descriptor
- `xs-security.json` — XSUAA role scopes and role templates

## Run in SAP Business Application Studio

From the project root:

```bash
npm install
npm run watch-landingpage
```

Other UI previews are available through the scripts in the root `package.json`, including `watch-admindashboard`, `watch-userdashboard`, `watch-applicationworkflow`, `watch-healthmanagement`, and `watch-inspectionmanagement`.

Development uses CAP's `dummy` authentication provider to avoid hard-coded usernames and passwords. This is only for local development. The production profile uses XSUAA.

## Deploy to SAP BTP Cloud Foundry

Prerequisites:

- SAP HANA Cloud is provisioned and running.
- Cloud Foundry org and space are selected.
- Cloud Foundry CLI and the MTA Build Tool (`mbt`) are available in the build/deployment environment.

Build and deploy from the repository root:

```bash
npm install --no-audit --no-fund
mbt build -t mta_archives
cf deploy mta_archives/animal-adoption_1.0.0.mtar
```

The MTA defines the CAP service, HANA HDI container, App Router, and XSUAA application. The production database configuration uses `@cap-js/hana` and an HDI container; SQLite is not the deployment database.

## Assign access in BTP Cockpit

After deployment, open **BTP Cockpit → Security → Role Collections** and assign users to the role collections created for the application:

- **Animal Adoption Admin** — administrative services and dashboards
- **Animal Adoption User** — adoption-user services
- **Animal Adoption Inspector** — inspection services

The App Router and XSUAA are intentionally retained: they perform the BTP login/session flow and pass the authenticated identity to CAP. Application role checks are enforced by CAP service annotations and the XSUAA roles, not by an in-app username/password screen.

The user dashboard creates an application profile for a first-time authenticated identity with the XSUAA `User` role. Admin profile information is read from the BTP identity claims; access to Admin services still requires the Admin role.

## Before production use

The repair branch has been reviewed at source level, but a live SAP BTP deployment and a complete Fiori browser test still need to be run in your BAS/BTP environment. Verify role collection assignments, HANA HDI binding, and each portal's service calls after deployment.
