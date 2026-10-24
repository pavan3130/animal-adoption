# Animal Adoption Management System

SAP CAP + Fiori elements application generated in SAP Business Application Studio.

## Local development in BAS

Use Node.js 22 and run these commands from the repository root:

```bash
git pull origin main
npm install
npm run watch-landingpage
```

The landing page opens with the Admin, Adoption User, and Inspector portal cards. Local CAP development now uses the `dummy` authentication profile so the browser does not show a username/password prompt. **This is only for local development:** CAP dummy authentication bypasses role checks locally, so don't expose the local development server publicly.

To open an individual generated application, use its existing script, for example:

```bash
npm run watch-admindashboard
npm run watch-userdashboard
npm run watch-inspectionmanagement
npm run watch-applicationworkflow
npm run watch-healthmanagement
```

## Production sign-in using SAP BTP

The production authentication profile remains `xsuaa`. The deployed AppRouter starts SAP BTP/XSUAA sign-in for protected dashboard and OData routes; this project does not need a custom username/password form.

The role templates are defined in `xs-security.json` and the deployment descriptor `mta.yaml` defines role collections for:
- Animal Adoption Admin
- Animal Adoption User
- Animal Adoption Inspector

After deploying the MTA, open SAP BTP Cockpit → Subaccount → Security → Role Collections. Assign the appropriate application role to each role collection and assign BTP users to the required collection. The protected services enforce the corresponding CAP roles:
- `AdminService` → `Admin`
- `UserService` → `User`
- `InspectorService` → `Inspector` or `Admin`

The public landing page is only a navigation page. Dashboard and OData routes remain protected by XSUAA in production.

## Note about user records

`db/data/animaladoption-Users.csv` contains application profile records used by the business features (name, email, role and status); it does not contain passwords and is not the sign-in mechanism. These records are retained because some dashboard workflows use them to display user and inspector profiles.

## Deployment

The project includes `mta.yaml`, `xs-security.json`, an AppRouter, and SAP HANA Cloud HDI container configuration. Use the existing Cloud Foundry deployment process for this MTA. Before deploying, ensure the target BTP subaccount and space are entitled for HANA HDI and XSUAA.
