import Badge from "../Badge/Badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = status.toUpperCase();

  let variant: "neutral" | "primary" | "success" | "warning" | "error" | "info" = "neutral";
  let label = status;

  switch (normStatus) {
    case "ACTIVE":
    case "APPROVED":
    case "SUCCESS":
      variant = "success";
      label = normStatus === "ACTIVE" ? "Active" : normStatus === "APPROVED" ? "Approved" : "Success";
      break;
    case "PENDING":
    case "MAINTENANCE":
      variant = "warning";
      label = normStatus === "PENDING" ? "Pending" : "Maintenance";
      break;
    case "INACTIVE":
    case "SUSPENDED":
    case "REJECTED":
    case "REVOKED":
    case "FAILURE":
    case "EXPIRED":
      variant = "error";
      label =
        normStatus === "INACTIVE"
          ? "Inactive"
          : normStatus === "SUSPENDED"
          ? "Suspended"
          : normStatus === "REJECTED"
          ? "Rejected"
          : normStatus === "REVOKED"
          ? "Revoked"
          : normStatus === "EXPIRED"
          ? "Expired"
          : "Failure";
      break;
    case "STAGING":
    case "DEVELOPMENT":
      variant = "info";
      label = normStatus === "STAGING" ? "Staging" : "Development";
      break;
    case "PRODUCTION":
      variant = "primary";
      label = "Production";
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
