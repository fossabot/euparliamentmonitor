# Hack23 ISMS Skills - Comprehensive Coverage

This document maps all Hack23 ISMS-PUBLIC policies to agent skills for complete organizational compliance.

---

## 🛡️ Secure Development Policy Skills

### **📋 Planning & Design Skills**
- `project-classification-analysis` - Comprehensive classification per Classification Framework including CIA triad, RTO/RPO, business impact
- `security-architecture-design` - Design patterns aligned with classification levels and business value requirements
- `risk-assessment-integration` - Integration with Risk Register for classification-driven security decisions
- `cost-benefit-analysis` - Security investments supporting cost efficiency objectives based on classification ROI
- `threat-modeling-stride` - STRIDE framework application for systematic threat categorization
- `attack-tree-development` - Structured attack path analysis with business impact assessment
- `mitre-attack-mapping` - Advanced threat intelligence and attack vector analysis

**Evidence:** [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#phase-1-planning--design)

### **💻 Development Skills**
- `owasp-top-10-implementation` - OWASP Top 10 and language-specific best practices aligned with project classification
- `secure-code-review` - Security-focused peer review for critical components based on integrity and confidentiality levels
- `asset-classification-application` - Apply Data Classification Policy and project classification to all code assets
- `secret-management-implementation` - No hardcoded credentials; systematic secret rotation aligned with classification requirements
- `ai-assisted-development-controls` - GitHub Copilot usage with human accountability and security gates
- `curator-agent-governance` - Configuration management for agent ecosystem with CEO approval requirements

**Evidence:** [Secure Development Policy - Phase 2: Development](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#phase-2-development)

### **🧪 Security Testing Skills**
- `sast-implementation` - SonarCloud integration on every commit with classification-appropriate quality gates
- `sca-dependency-scanning` - Automated dependency vulnerability scanning with SBOM generation
- `dast-integration` - OWASP ZAP scanning in staging environments based on classification levels
- `secret-scanning-implementation` - Continuous monitoring for exposed credentials and keys
- `test-data-protection` - Prohibition on production data, anonymization, secure deletion
- `zap-baseline-scanning` - Automated passive security scanning on every build
- `zap-full-scanning` - Comprehensive active security testing in staging environments

**Evidence:** 
- [SAST/SCA/DAST](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#phase-3-security-testing)
- [ZAP Scanning](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#owasp-zap-security-scanning-requirements)

### **🧬 Unit Testing Skills**
- `unit-test-coverage-standards` - Minimum 80% line coverage, 70% branch coverage
- `jacoco-integration` - JaCoCo for Java test coverage reporting
- `jest-vitest-coverage` - Jest/Vitest for JavaScript/TypeScript coverage
- `test-automation-execution` - Tests run on every commit and pull request
- `coverage-trend-analysis` - Historical coverage tracking and regression prevention
- `test-plan-documentation` - Comprehensive UnitTestPlan.md for each repository

**Evidence:**
- [Unit Test Requirements](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#unit-test-coverage--quality)
- **Reference Implementations:**
  - [CIA JaCoCo Results](https://hack23.github.io/cia/jacoco/)
  - [Black Trigram Coverage](https://blacktrigram.com/coverage/)
  - [CIA Compliance Manager Coverage](https://ciacompliancemanager.com/coverage/)

### **🌐 E2E Testing Skills**
- `e2e-critical-path-coverage` - All user journeys and business workflows tested
- `e2e-test-plan-documentation` - Comprehensive E2ETestPlan.md for each project
- `mochawesome-reporting` - Public test results via Mochawesome reports
- `cross-browser-testing` - Validation across major browser platforms
- `e2e-performance-assertions` - Response time validation within E2E tests
- `cypress-automation` - Cypress for E2E test automation
- `playwright-automation` - Playwright for advanced E2E scenarios

**Evidence:**
- [E2E Testing Strategy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#end-to-end-testing-strategy)
- **Reference Implementations:**
  - [CIA Integration Tests](https://hack23.github.io/cia/surefire.html)
  - [Black Trigram Cypress](https://blacktrigram.com/cypress/mochawesome/)
  - [CIA Compliance Manager Cypress](https://ciacompliancemanager.com/cypress/mochawesome/)

### **🎯 Threat Modeling Skills**
- `stride-framework-application` - Systematic threat categorization for all system components
- `threat-agent-classification` - External, internal, and supply chain threat actor evaluation
- `risk-based-prioritization` - Threat ranking aligned with Classification Framework
- `threat-model-documentation` - THREAT_MODEL.md with comprehensive threat analysis
- `attack-tree-analysis` - Detailed attack path modeling with probability/impact metrics
- `quantitative-risk-assessment` - Business impact analysis and risk scoring
- `security-control-mapping` - Implemented mitigations with effectiveness validation
- `change-impact-assessment` - Threat model updates for architectural changes

**Evidence:**
- [Threat Modeling Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Threat_Modeling.md)
- **Reference Implementations:**
  - [CIA Threat Model](https://github.com/Hack23/cia/blob/master/THREAT_MODEL.md)
  - [Black Trigram Threat Model](https://github.com/Hack23/blacktrigram/blob/main/THREAT_MODEL.md)
  - [CIA Compliance Manager Threat Model](https://github.com/Hack23/cia-compliance-manager/blob/main/docs/architecture/THREAT_MODEL.md)

### **⚡ Performance Testing Skills**
- `lighthouse-audits` - Automated performance, accessibility, and SEO scoring
- `load-testing-k6` - Performance validation under expected and peak traffic
- `performance-budgets` - Defined thresholds for page load times and resources
- `real-user-monitoring` - Production performance tracking and alerting
- `performance-regression-prevention` - Automated performance gate validation
- `performance-documentation` - performance-testing.md with benchmarks and analysis

**Evidence:**
- [Performance Testing Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#performance-testing--monitoring-framework)
- **Reference Implementations:**
  - [Black Trigram Performance](https://github.com/Hack23/blacktrigram/blob/main/performance-testing.md)
  - [CIA Compliance Manager Performance](https://github.com/Hack23/cia-compliance-manager/blob/main/docs/performance-testing.md)

### **🔄 CI/CD Workflow Skills**
- `multi-stage-quality-gates` - SonarCloud, security scanning, and performance validation
- `test-automation-pipeline` - Unit, integration, E2E, and performance testing
- `security-automation-pipeline` - SAST, SCA, DAST, and secret scanning integration
- `artifact-management` - SBOM generation, signing, and attestation
- `pipeline-analytics` - Build metrics, failure analysis, and improvement tracking
- `automated-rollback` - Failure detection and automatic reversion capabilities
- `workflows-documentation` - Complete pipeline documentation (WORKFLOWS.md)
- `status-badge-integration` - Real-time build, test, and security status display

**Evidence:**
- [CI/CD Workflow Excellence](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#cicd-workflow--automation-excellence)
- **Reference Implementations:**
  - [CIA WORKFLOWS.md](https://github.com/Hack23/cia/blob/master/WORKFLOWS.md)
  - [Black Trigram WORKFLOWS.md](https://github.com/Hack23/blacktrigram/blob/main/WORKFLOWS.md)
  - [CIA Compliance Manager WORKFLOWS.md](https://github.com/Hack23/cia-compliance-manager/blob/main/docs/architecture/WORKFLOWS.md)

### **📦 SBOM & Supply Chain Skills**
- `sbom-cyclonedx-generation` - CycloneDX format SBOM generation
- `sbom-spdx-generation` - SPDX format SBOM generation
- `dependency-transparency` - Complete component inventory and tracking
- `supply-chain-security` - Vulnerability tracking across all dependencies
- `license-compliance-management` - Open source license management and verification
- `artifact-signing-sigstore` - Digital signatures for integrity verification (Sigstore/cosign)
- `slsa-level-3-attestation` - Build provenance and integrity attestation
- `openssf-scorecard` - Supply chain security assessment
- `fossa-license-scanning` - Automated license compliance verification

**Evidence:**
- [SBOM Requirements](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#software-bill-of-materials-sbom-requirements)
- **Reference Implementations:**
  - [CIA Attestations](https://github.com/Hack23/cia/attestations)
  - [Black Trigram Attestations](https://github.com/Hack23/blacktrigram/attestations)
  - [CIA Compliance Manager Attestations](https://github.com/Hack23/cia-compliance-manager/attestations)

### **🤖 Automated Security Integration Skills**
- `documentation-validation` - Verify presence and completeness of security architecture files
- `security-scanning-pipeline` - SAST, SCA, and secret scanning on all pull requests
- `critical-issue-blocking` - High/critical vulnerabilities prevent merge per Vulnerability Management SLAs
- `badge-generation-automation` - Automated security posture reporting via public badges
- `openssf-scorecard-integration` - Supply chain security assessment and scoring
- `cii-best-practices-certification` - Open source security maturity demonstration
- `sonarcloud-quality-gates` - Code quality and security standard compliance

**Evidence:**
- [Automated Security Integration](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#automated-security-integration)
- **Badge Examples:**
  - CIA: [![OpenSSF](https://api.securityscorecards.dev/projects/github.com/Hack23/cia/badge)](https://scorecard.dev/viewer/?uri=github.com/Hack23/cia)
  - Black Trigram: [![OpenSSF](https://api.securityscorecards.dev/projects/github.com/Hack23/blacktrigram/badge)](https://scorecard.dev/viewer/?uri=github.com/Hack23/blacktrigram)

### **🚀 Deployment & Operations Skills**
- `automated-cicd-pipelines` - Security gates preventing vulnerable code promotion
- `manual-approval-gates` - Risk-based approval for production deployments
- `deployment-checklists` - Security verification before service activation
- `security-metrics-monitoring` - Real-time monitoring with classification-appropriate SLAs
- `vulnerability-management-slas` - Classification-based remediation (Critical: 24h, High: 7d, Medium: 30d, Low: 90d)
- `performance-monitoring` - Security metrics integration with availability requirements
- `regular-updates-management` - Security patches and dependency updates
- `incident-response-integration` - Classification-driven escalation procedures

**Evidence:**
- [Phase 4: Deployment](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#phase-4-deployment)
- [Phase 5: Maintenance](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#phase-5-maintenance--operations)

---

## 🔓 Open Source Policy Skills

### **🎖️ Security Posture Evidence Skills**
- `openssf-scorecard-maintenance` - Supply chain security assessment ≥7.0 score
- `cii-best-practices-compliance` - Open source maturity at least "Passing" level
- `slsa-level-3-implementation` - Build provenance and integrity attestation
- `quality-gate-validation` - SonarCloud or equivalent showing "Passed" status
- `fossa-status-integration` - License scanning and compliance verification
- `reuse-compliance` - Clear licensing information for all files
- `license-badge-display` - Clear display of repository license

**Evidence:**
- [Security Posture Evidence](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md#1-security-posture-evidence)
- **Reference Implementations:**
  - [CIA Badges](https://github.com/Hack23/cia#readme)
  - [Black Trigram Badges](https://github.com/Hack23/blacktrigram#readme)
  - [CIA Compliance Manager Badges](https://github.com/Hack23/cia-compliance-manager#readme)

### **📋 Governance Artifacts Skills**
- `security-architecture-documentation` - SECURITY_ARCHITECTURE.md with current implementation
- `future-security-architecture-planning` - FUTURE_SECURITY_ARCHITECTURE.md with roadmap
- `security-md-vulnerability-disclosure` - Coordinated vulnerability disclosure process
- `workflows-documentation-cicd` - CI/CD pipeline documentation with security gates
- `license-file-maintenance` - OSI-approved license clearly stated
- `notice-file-attribution` - Attribution for third-party components
- `licenses-directory-management` - Directory containing all dependency licenses
- `reuse-dep5-configuration` - Machine-readable licensing information
- `cra-assessment-documentation` - EU Cyber Resilience Act compliance assessment
- `code-of-conduct-maintenance` - Community behavior standards
- `contributing-guidelines` - Contribution guidelines and requirements
- `readme-classification-section` - Project classification per Classification Framework

**Evidence:**
- [Governance Artifacts](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md#2-governance-artifacts)
- **Reference Implementations:**
  - [CIA Security Docs](https://github.com/Hack23/cia#security)
  - [Black Trigram Security Docs](https://github.com/Hack23/blacktrigram#security)

### **🔒 Security Implementation Skills**
- `sbom-generation-cyclonedx` - CycloneDX or SPDX format for all releases
- `dependency-scanning-automation` - Automated vulnerability detection via Dependabot/Renovate
- `license-scanning-fossa` - FOSSA integration for continuous compliance monitoring
- `artifact-signing-implementation` - Sigstore/cosign for release integrity
- `vulnerability-management-slas-critical` - Critical remediation within 24 hours
- `vulnerability-management-slas-high` - High remediation within 7 days
- `vulnerability-management-slas-medium` - Medium remediation within 30 days
- `vulnerability-management-slas-low` - Low remediation within 90 days
- `sast-sonarcloud-integration` - SonarCloud or equivalent on every commit
- `sca-dependency-scanning-automation` - Dependency vulnerability scanning
- `secret-scanning-github` - GitHub secret scanning or equivalent
- `dast-owasp-zap` - OWASP ZAP for web applications

**Evidence:**
- [Security Implementation Requirements](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md#3-security-implementation-requirements)
- **Live Evidence:**
  - [CIA Security Overview](https://github.com/Hack23/cia/security)
  - [Black Trigram Security](https://github.com/Hack23/blacktrigram/security)

### **📊 License Compliance Skills**
- `approved-licenses-permissive` - MIT, Apache 2.0, BSD, ISC
- `approved-licenses-weak-copyleft` - LGPL 2.1/3.0, MPL 2.0, EPL 2.0
- `approved-licenses-documentation` - CC-BY-4.0, CC-BY-SA-4.0
- `review-required-licenses-copyleft` - GPL 2.0/3.0, AGPL 3.0 (CEO approval)
- `review-required-licenses-nonstandard` - Custom or modified licenses
- `review-required-licenses-commercial` - Dual-licensed components
- `prohibited-licenses-advertising` - Licenses with advertising clauses
- `prohibited-licenses-incompatible` - Licenses incompatible with primary license
- `license-scanning-automation` - FOSSA runs on every pull request
- `license-manual-review` - Required for license conflicts or exceptions
- `compliance-reports-monthly` - Monthly FOSSA reports reviewed by CEO
- `attribution-management-automated` - Automated NOTICE file generation

**Evidence:**
- [License Compliance Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md#4-license-compliance-framework)
- **FOSSA Integration:**
  - [CIA License Report](https://app.fossa.com/projects/git%2Bgithub.com%2FHack23%2Fcia)
  - [Black Trigram License Report](https://app.fossa.io/projects/git%2Bgithub.com%2FHack23%2Fblacktrigram)

### **🏷️ Classification & Documentation Skills**
- `classification-cia-triad` - Confidentiality, Integrity, Availability levels
- `classification-business-impact` - Financial, Operational, Reputational, Regulatory
- `classification-rto-rpo` - Recovery objectives aligned with classification
- `classification-strategic-value` - ROI and competitive positioning
- `architecture-documentation-c4` - C4 models (Context, Container, Component, Code)
- `architecture-documentation-mermaid` - Mermaid diagrams for workflows and sequences
- `data-model-documentation` - Comprehensive data structure documentation
- `flowchart-documentation` - Business process flows and decision trees
- `state-diagram-documentation` - State transitions and lifecycle management
- `mindmap-documentation` - Conceptual relationships and system overview
- `swot-analysis-documentation` - Strategic analysis and planning

**Evidence:**
- [Classification & Documentation](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md#5-classification--documentation)
- [Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
- **Reference Implementations:**
  - [CIA Architecture Docs](https://github.com/Hack23/cia#architecture)
  - [Black Trigram Architecture](https://github.com/Hack23/blacktrigram#architecture)

### **🤝 Community Engagement Skills**
- `contributor-guide-maintenance` - Clear contribution process and expectations
- `code-of-conduct-enforcement` - Community standards and enforcement procedures
- `issue-template-management` - Structured issue reporting and tracking
- `pr-template-management` - Pull request guidelines and checklists
- `discussion-forum-moderation` - GitHub Discussions or equivalent
- `community-building` - Engagement strategies and recognition programs
- `security-disclosure-process` - Coordinated vulnerability disclosure and response
- `documentation-portal-maintenance` - Non-technical audience accessibility

**Evidence:**
- [Community Engagement Best Practices](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md#community-engagement)
- **Reference Implementations:**
  - [CIA Contributing](https://github.com/Hack23/cia/blob/master/CONTRIBUTING.md)
  - [Black Trigram Code of Conduct](https://github.com/Hack23/blacktrigram/blob/main/CODE_OF_CONDUCT.md)

---

## 🎯 Cross-Cutting ISMS Skills

### **🏛️ Architecture Documentation Portfolio Skills**
- `architecture-md-current-state` - Complete C4 models for current implementation
- `data-model-md-structures` - Comprehensive data structures and schemas
- `flowchart-md-business-processes` - Business process flows and workflows
- `statediagram-md-transitions` - State transitions and lifecycle management
- `mindmap-md-conceptual` - Conceptual relationships and system overview
- `swot-md-strategic` - Strategic analysis (Strengths, Weaknesses, Opportunities, Threats)
- `future-architecture-md-roadmap` - Evolution roadmap and planned improvements
- `future-data-model-md-enhancements` - Enhanced data structures planning
- `future-flowchart-md-improvements` - Improved workflow designs
- `future-statediagram-md-advanced` - Advanced state management planning
- `future-mindmap-md-expansion` - Capability expansion planning
- `future-swot-md-opportunities` - Future opportunities analysis

**Evidence:**
- [Architecture Documentation Matrix](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md#architecture-documentation-matrix)
- **CIA Reference:**
  - [ARCHITECTURE.md](https://github.com/Hack23/cia/blob/master/ARCHITECTURE.md)
  - [SECURITY_ARCHITECTURE.md](https://github.com/Hack23/cia/blob/master/SECURITY_ARCHITECTURE.md)
  - [FUTURE_SECURITY_ARCHITECTURE.md](https://github.com/Hack23/cia/blob/master/FUTURE_SECURITY_ARCHITECTURE.md)

### **📊 ISMS Compliance Framework Skills**
- `iso-27001-2022-implementation` - ISO 27001:2022 control implementation
- `nist-csf-2-mapping` - NIST Cybersecurity Framework 2.0 function alignment
- `cis-controls-v8-1-application` - CIS Controls v8.1 implementation
- `gdpr-compliance` - General Data Protection Regulation compliance
- `nis2-directive-compliance` - Network and Information Security Directive 2
- `eu-cra-compliance` - EU Cyber Resilience Act compliance
- `classification-framework-application` - Comprehensive project classification
- `risk-register-maintenance` - Risk identification, assessment, and mitigation
- `vulnerability-management-process` - Systematic vulnerability handling
- `incident-response-planning` - Incident detection, response, and recovery
- `change-management-process` - Controlled change implementation
- `business-continuity-planning` - Continuity and disaster recovery
- `security-metrics-tracking` - Security KPIs and performance measurement

**Evidence:**
- [ISMS Framework](https://github.com/Hack23/ISMS-PUBLIC/)
- [ISO 27001 Mapping](https://github.com/Hack23/ISMS-PUBLIC/blob/main/ISO27001_Mapping.md)
- [NIST CSF Mapping](https://github.com/Hack23/ISMS-PUBLIC/blob/main/NIST_CSF_Mapping.md)
- [CIS Controls Mapping](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CIS_Controls_Mapping.md)

---

## 📚 Skills Usage in Agents

Each agent leverages appropriate ISMS skills based on their domain:

### **Product Task Agent**
Primary: project-classification-analysis, risk-assessment-integration, threat-modeling-stride, openssf-scorecard-maintenance, governance-artifacts-skills

### **News Journalist**
Primary: security-architecture-documentation, classification-cia-triad, community-engagement-skills, gdpr-compliance

### **Frontend Specialist**
Primary: owasp-top-10-implementation, wcag-accessibility-compliance, performance-testing-skills, lighthouse-audits, cross-browser-testing

### **Data Pipeline Specialist**
Primary: sbom-generation-cyclonedx, sca-dependency-scanning, supply-chain-security, api-security-implementation, data-classification-application

### **DevOps Engineer**
Primary: multi-stage-quality-gates, security-automation-pipeline, artifact-management, slsa-level-3-implementation, workflows-documentation-cicd

### **Security Architect**
Primary: threat-modeling-stride, security-control-mapping, vulnerability-management-slas, iso-27001-2022-implementation, cra-assessment-documentation

### **Documentation Architect**
Primary: architecture-documentation-c4, security-architecture-documentation, threat-model-documentation, architecture-md-current-state, mermaid-diagram-generation

### **Quality Engineer**
Primary: unit-test-coverage-standards, e2e-critical-path-coverage, sast-implementation, dast-integration, performance-regression-prevention

---

**Last Updated:** 2026-02-16  
**Version:** 1.0  
**Maintained by:** Hack23 AB - Agent Curator
