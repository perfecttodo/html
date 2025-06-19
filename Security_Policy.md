# Security Policy for TreeGrid Jira Cloud App

## 1. Introduction
TreeGrid is a client-side Jira Cloud application that runs entirely in the user’s browser, built on Atlassian’s Forge platform. It provides a grid or list layout for double-click data entry and organizes data using a tree structure for hierarchical visualization and management, with export support for XML, JSON, CSV, and TXT formats only. We are committed to ensuring robust data security, privacy, and compliance to protect user information. This Security Policy outlines our approach to safeguarding your data and maintaining trust.

## 2. Data Storage and Processing
### 2.1 Data Residency
- All TreeGrid data, including grids, lists, and tree structures, is stored exclusively within your Atlassian Jira Cloud instance, adhering to Atlassian’s data residency policies. Users can select their preferred data residency region, ensuring data at rest remains in that region.
- TreeGrid operates entirely client-side, with no data storage or processing on external servers.

### 2.2 Data Transmission
- Data is encrypted in transit using Transport Layer Security (TLS) 1.2+ with Perfect Forward Secrecy (PFS) when communicating between the user’s browser and Atlassian’s servers via Jira Cloud APIs.
- All data processing, including data entry, tree organization, and exports, occurs locally in the user’s browser, ensuring no data is sent to external entities.

### 2.3 Client-Side Processing
- TreeGrid is a fully client-side app running on Atlassian’s Forge platform. Features such as data input in grid or list layouts, tree manipulation, and exports to XML, JSON, CSV, and TXT formats are processed entirely in the browser.
- No TreeGrid servers are involved, eliminating the need for external data processing or storage.
- Exported files are generated locally and either saved as attachments in Jira Cloud or downloaded directly to the user’s device.

## 3. Data Privacy
- TreeGrid does not collect, store, or track user activity data, such as grid/list edits or tree navigation, outside of Atlassian’s infrastructure.
- All grid, list, and tree data reside solely in the user’s Jira Cloud instance or user-authorized cloud storage (e.g., Google Drive, Microsoft OneDrive) when explicitly integrated by the user for import/export.
- No metadata (e.g., IP address, browser information) is collected by TreeGrid, as no server-side logging occurs.

## 4. Access Control
- TreeGrid adheres to Jira Cloud’s permission model. Users can only view, edit, or manage TreeGrid data based on their Jira issue permissions (e.g., Edit Issues, Add Attachments).
- Jira administrators can configure app access rules to restrict TreeGrid’s scope to specific projects or issues, ensuring compliance with organizational policies.
- Clear error messages (e.g., “Insufficient permissions to edit grid”) are displayed when access is restricted.

## 5. Compliance and Certifications
- TreeGrid supports compliance with key data protection standards, including:
  - ISO/IEC 27001 and 27002 for information security management, as facilitated by Atlassian’s infrastructure.
  - General Data Protection Regulation (GDPR) through zero external data collection and user-controlled storage.
- As a client-side app, TreeGrid leverages Atlassian’s SOC 2 and ISO 27001 certifications for data stored in Jira Cloud.
- TreeGrid participates in Atlassian’s Marketplace Bug Bounty program to proactively identify and address vulnerabilities.

## 6. Security Features
- **Zero Egress Architecture**: Built on Atlassian’s Forge platform, TreeGrid ensures no data leaves your Jira Cloud environment or browser, as all processing, including exports to XML, JSON, CSV, and TXT, is client-side.
- **Encryption at Rest**: Data stored in Jira Cloud is protected by Atlassian’s AES-256 encryption at rest.
- **Client-Side Security**: TreeGrid uses modern browser security features (e.g., Content Security Policy, Same-Origin Policy) to prevent unauthorized access or script injection.
- **Change Tracking**: TreeGrid leverages Jira Cloud’s attachment versioning to maintain an audit trail of changes to grids, lists, and tree structures.

## 7. User-Controlled Features
- **Export Formats**: Users can export data only in XML, JSON, CSV, and TXT formats, with all processing performed locally in the browser.
- **Offline Mode**: TreeGrid supports limited offline functionality through browser-based caching, allowing data entry and tree organization without an internet connection. Data is synced to Jira Cloud when connectivity is restored.
- **Data Anonymization**: An optional client-side plugin enables users to redact sensitive data in grid/list cells or tree nodes before exporting, ensuring compliance with GDPR or contractual obligations.
- **Integration Options**: Users can optionally connect to cloud storage (e.g., Google Drive, OneDrive) for imports/exports in supported formats, with explicit authorization required.

## 8. Vulnerability Management
- Vulnerabilities in TreeGrid’s client-side code are identified through Atlassian’s Marketplace Bug Bounty program and regular code reviews.
- Issues are triaged based on CVSS severity scores, with critical vulnerabilities addressed immediately via Forge’s rapid deployment capabilities.
- Updates are delivered seamlessly to users’ browsers, maintaining 99.99% availability.

## 9. Integration with Atlassian Security
- TreeGrid complies with Atlassian’s Security Requirements for Cloud Apps, avoiding the collection or storage of user credentials (e.g., passwords, API tokens).
- As a Forge-based app, TreeGrid benefits from Atlassian’s sandboxed environment, ensuring enhanced isolation and security.
- Administrators receive notifications of app access changes via Atlassian’s Data Policies REST APIs, ensuring transparency.

## 10. Incident Response
- In the unlikely event of a security incident, TreeGrid follows a structured response process:
  - Immediate investigation and mitigation, leveraging Atlassian’s Forge platform logs.
  - Notification to affected users and Atlassian within 24 hours, as required.
  - Post-incident analysis to prevent recurrence.
- Users can contact our support team at [security@treegrid.com](mailto:security@treegrid.com) for incident-related inquiries.

## 11. User Responsibilities
- Configure Jira Cloud permissions to enable data entry, tree management, and export functionality as needed.
- Authorize access to external cloud storage (e.g., Google Drive, OneDrive) only when importing or exporting data in XML, JSON, CSV, or TXT formats.
- Use supported, up-to-date browsers (e.g., Chrome, Firefox, Edge) to ensure TreeGrid’s client-side security features function correctly.

## 12. Contact and Support
- For security inquiries or to request a Data Processing Agreement (DPA), contact us at [support@treegrid.com](mailto:support@treegrid.com).
- Visit our [Security Page](https://treegrid.com/security) for details on compliance, certifications, and security practices.
- Report vulnerabilities via Atlassian’s Marketplace Bug Bounty program or directly to our security team.

## 13. Policy Updates
- This policy is reviewed annually or as needed to reflect changes in regulations, technology, or Atlassian’s requirements.
- Significant updates will be communicated to users via in-app notifications or Atlassian Marketplace announcements.

---

By using TreeGrid, you agree to our [End-User License Agreement (EULA)](https://treegrid.com/eula) and trust our commitment to securing your data. We strive to provide a secure, grid- or list-based, tree-organized data management solution for Jira Cloud, exceeding industry standards.