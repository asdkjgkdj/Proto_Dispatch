import React, { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export default function DispatchMission({ units, onComplete }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const dispatch = () => {
    const power = selected.length * 50;
    const success = power >= 100;
    const reward = { gold: 100, gems: 5, xp: 20 };
    onComplete({ units: selected, success, reward });
    setSelected([]);
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Dispatch Mission</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {units.map(u => (
            <div
              key={u.id}
              className={`p-2 border ${
                selected.includes(u.id) ? 'border-blue-500' : 'border-gray-300'
              }`}
              onClick={() => toggle(u.id)}
            >
              {u.grade}
            </div>
          ))}
        </div>
        <Button onClick={dispatch} disabled={!selected.length}>
          Dispatch ({selected.length})
        </Button>
      </CardContent>
    </Card>
  );
}