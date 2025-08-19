import { ErrorFallback } from "@/components/layouts/Error";
import { ProtectedRoute } from "./PrivateRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Dashboard } from "@/layouts/Dashboard";
import { NotFound } from "@/layouts/NotFound";
import { PublicRoute } from "./PublicRoute";
import Login from "@/pages/Login";
import { DashboardPage } from "@/pages/DashboardPage";
import SolicitationManagementPage from "@/pages/SolicitationManagementPage";
import SolicitationDetailPage from "@/pages/SolicitationManagementPage/SolicitationDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import ForgotPassword from "@/pages/ForgotPasswordPage";
import ResetPassword from "@/pages/ResetPasswordPage";
import VendorManagementPage from "@/pages/VendorManagementPage";
import VendorDetailPage from "@/pages/VendorManagementPage/VendorDetailPage";
import EvaluationManagementPage from "@/pages/EvaluationManagementPage";
import EvaluationDetailPage from "@/pages/EvaluationManagementPage/EvaluationDetailPage";
import InvitationsPage from "@/pages/InvitationsPage";
import ConfirmAlertDemo from "@/demo/ConfirmAlertDemo";
import AssignedEvaluationDetailPage from "@/pages/EvaluationManagementPage/AssignedEvaluationDetailPage";
import SubmittedDocumentPage from "@/pages/EvaluationManagementPage/SubmittedDocumentPage";
import UserManagementPage from "@/pages/UserManagementPage/UserManagementPage";
import CompaniesPage from "@/pages/CompaniesPage";
import CompanyDetailPage from "@/pages/CompaniesPage/CompanyDetailPage";
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import SubscriptionDetailPage from "@/pages/SubscriptionsPage/SubscriptionDetailPage";
import AdminManagementPage from "@/pages/AdminManagementPage";
import SystemLogPage from "@/pages/SystemLogPage";
import PortalSettingsPage from "@/pages/PortalSettingsPage";
// import CommunicationManagementPage from "@/pages/CommunicationManagementPage";
import OnboardingPage from "@/pages/OnboardingPage";
import VendorOnboardingPage from "@/pages/OnboardingPage/VendorOnboardingPage";
import SubmitProposalPage from "@/pages/SolicitationManagementPage/components/SubmitProposalPage";
import EditProposalPage from "@/pages/SolicitationManagementPage/components/EditProposalPage";
import ProposalDetailsPage from "@/pages/SolicitationManagementPage/ProposalDetailsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsConditionsPage from "@/pages/TermsConditionsPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import ContactUsPage from "@/pages/ContactUsPage";
// import Example from "@/pages/Example";

export const routes = [
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
      // {
      //   path: "/example",
      //   element: (
      //     <PublicRoute>
      //       <Example />
      //     </PublicRoute>
      //   ),
      // },
      {
        path: "/onboarding/:encodedData",
        element: (
          <PublicRoute>
            <OnboardingPage />
          </PublicRoute>
        ),
      },
      {
        path: "/vendor-onboarding/:encodedData",
        element: (
          <PublicRoute>
            <VendorOnboardingPage />
          </PublicRoute>
        ),
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/terms-conditions",
        element: <TermsConditionsPage />,
      },
      {
        path: "/disclaimer",
        element: <DisclaimerPage />,
      },
      {
        path: "/contact-us",
        element: <ContactUsPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/solicitation",
        element: (
          <ProtectedRoute>
            <SolicitationManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/solicitation/:id",
        element: (
          <ProtectedRoute>
            <SolicitationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/solicitations/:id/submit-proposal",
        element: (
          <ProtectedRoute>
            <SubmitProposalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/solicitations/:id/proposal-details/:proposalId",
        element: (
          <ProtectedRoute>
            <ProposalDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/solicitations/:id/edit-proposal/:proposalId",
        element: (
          <ProtectedRoute>
            <EditProposalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/vendor",
        element: (
          <ProtectedRoute>
            <VendorManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/vendor/:id",
        element: (
          <ProtectedRoute>
            <VendorDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/evaluation",
        element: (
          <ProtectedRoute>
            <EvaluationManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/evaluation/:id",
        element: (
          <ProtectedRoute>
            <EvaluationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/evaluation/assigned/:id/:groupId",
        element: (
          <ProtectedRoute>
            <AssignedEvaluationDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/evaluation/submitted-documents/:id/:groupId/:vendorId",
        element: (
          <ProtectedRoute>
            <SubmittedDocumentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/invitations",
        element: (
          <ProtectedRoute>
            <InvitationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/invitations/:id",
        element: (
          <ProtectedRoute>
            <InvitationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/user-management",
        element: (
          <ProtectedRoute>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/companies",
        element: (
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/company/:id",
        element: (
          <ProtectedRoute>
            <CompanyDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/subscription",
        element: (
          <ProtectedRoute>
            <SubscriptionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/subscription/:id",
        element: (
          <ProtectedRoute>
            <SubscriptionDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/admin-management",
        element: (
          <ProtectedRoute>
            <AdminManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/system-log",
        element: (
          <ProtectedRoute>
            <SystemLogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/portal-settings",
        element: (
          <ProtectedRoute>
            <PortalSettingsPage />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/dashboard/communication-management",
      //   element: (
      //     <ProtectedRoute>
      //       <CommunicationManagementPage />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "/dashboard/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/demo",
        element: (
          <ProtectedRoute>
            <ConfirmAlertDemo />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
