export default function TrustScoreMeter({ score }) {
  const color =
    score >= 85 ? "text-green-600" : score >= 70 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="text-center">
      <div className={`text-4xl font-bold ${color}`}>{score}</div>
      <p className="text-sm text-gray-500">Trust Score</p>
    </div>
  );
}
