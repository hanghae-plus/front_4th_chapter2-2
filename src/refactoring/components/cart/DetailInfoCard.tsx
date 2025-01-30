interface DetailInfoCardProps {
  cardTitle: string;
  children: React.ReactNode;
}

const DetailInfoCard = ({ cardTitle, children }: DetailInfoCardProps) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">{cardTitle}</h2>
      {children}
    </div>
  );
};

export default DetailInfoCard;
