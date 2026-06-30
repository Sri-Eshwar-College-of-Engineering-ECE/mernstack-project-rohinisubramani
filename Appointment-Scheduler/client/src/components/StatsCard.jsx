const StatsCard = ({ title, value, color }) => {
  return (
    <div className={`rounded-xl shadow-lg p-6 text-white ${color}`}>

      <h3 className="text-lg">{title}</h3>

      <h1 className="text-4xl font-bold">
        {value}
      </h1>

    </div>
  );
};

export default StatsCard;