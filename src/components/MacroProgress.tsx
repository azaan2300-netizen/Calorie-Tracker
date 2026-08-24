interface BarProps {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  colorClass: string;
}

function ProgressBar({ label, consumed, target, unit, colorClass }: BarProps) {
  const pct = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
  const over = target > 0 && consumed > target;
  return (
    <div className="progress-row">
      <div className="progress-label">
        <span>{label}</span>
        <span className={over ? 'over' : ''}>
          {Math.round(consumed)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${colorClass} ${over ? 'over' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface Props {
  consumed: { calories: number; proteinG: number; carbsG: number; fatG: number };
  target: { calories: number; proteinG: number; carbsG: number; fatG: number };
}

export default function MacroProgress({ consumed, target }: Props) {
  return (
    <div className="macro-progress">
      <ProgressBar
        label="Calories"
        consumed={consumed.calories}
        target={target.calories}
        unit="kcal"
        colorClass="fill-calories"
      />
      <ProgressBar
        label="Protein"
        consumed={consumed.proteinG}
        target={target.proteinG}
        unit="g"
        colorClass="fill-protein"
      />
      <ProgressBar
        label="Carbs"
        consumed={consumed.carbsG}
        target={target.carbsG}
        unit="g"
        colorClass="fill-carbs"
      />
      <ProgressBar
        label="Fat"
        consumed={consumed.fatG}
        target={target.fatG}
        unit="g"
        colorClass="fill-fat"
      />
    </div>
  );
}
