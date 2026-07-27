import Card from "../../../shared/components/Card/Card";
import { typography } from "../../../theme/typography";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      <h1 className={typography.h1}>
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-5">

        <Card>

          <h3 className="font-semibold">
            Pending Requests
          </h3>

          <p className="text-3xl font-bold mt-3">
            18
          </p>
        </Card>

        <Card>

          <h3 className="font-semibold">
            Approved
          </h3>

          <p className="text-3xl font-bold mt-3">
            143
          </p>
        </Card>

        <Card>

          <h3 className="font-semibold">
            Rejected
          </h3>

          <p className="text-3xl font-bold mt-3">
            9
          </p>
        </Card>

        <Card>

          <h3 className="font-semibold">
            Active Users
          </h3>

          <p className="text-3xl font-bold mt-3">
            512
          </p>
        </Card>

      </div>
    </div>
  );
}