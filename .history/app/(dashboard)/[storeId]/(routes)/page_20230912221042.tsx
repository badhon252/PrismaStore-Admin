import prismadb from "@/lib/prismadb";

interface DashboardProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
};

export default function Dashboard() {
  return <div className="text-5">This is a Dashboard!</div>;
}
