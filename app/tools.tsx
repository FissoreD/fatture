type TdCenter = { name: string; rowSpan?: number };

export const TdC: React.FC<TdCenter> = ({ name, rowSpan }) => {
  return <td rowSpan={rowSpan || 1} className="align-middle text-center">{name}</td>;
};

export const TdH: React.FC<TdCenter> = ({ name, rowSpan }) => {
  return <th rowSpan={rowSpan || 1} className="align-middle text-center">{name}</th>;
};