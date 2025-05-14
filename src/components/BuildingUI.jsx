import React, { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export default function BuildingUI({ resources }) {
  const [tab, setTab] = useState('detail');
  const slots = 2;

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Training Facility</h2>
        <div className="flex space-x-2 mb-4">
          {['detail','upgrade','training'].map(t => (
            <Button
              key={t}
              variant={tab === t ? 'default' : 'outline'}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>

        {tab === 'detail' && (
          <div>
            <p>Level: 1</p>
            <p>Effects: Training Speed +30%, Dispatch Power +200</p>
          </div>
        )}
        {tab === 'upgrade' && (
          <div className="space-y-2">
            <p>Next Level Effects: +10% Speed</p>
            <p>Cost: 500 Gold or 5 Gems</p>
            <Button>Upgrade Now</Button>
          </div>
        )}
        {tab === 'training' && (
          <div className="space-y-2">
            {[...Array(slots)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <span>Slot {i+1}: Idle</span>
                <Button size="sm">Start</Button>
              </div>
            ))}
            <Button>Use Accelerator</Button>
          </div>
        )}

        <div className="mt-4 border-t pt-2">
          <p>Gold: {resources.gold}</p>
          <p>Gems: {resources.gems}</p>
          <p>XP: {resources.xp}</p>
        </div>
      </CardContent>
    </Card>
  );
}