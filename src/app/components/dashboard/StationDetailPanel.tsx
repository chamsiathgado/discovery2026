import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import {
  X,
  MapPin,
  Zap,
  Activity,
  Wrench,
  AlertTriangle,
  Battery,
  Calendar,
} from 'lucide-react';
import { Station, Borne, BorneStatus } from '@/app/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { toast } from 'sonner';

interface StationDetailPanelProps {
  station: Station;
  onClose: () => void;
  onUpdate: (station: Station) => void;
}

function getStatusColor(status: BorneStatus): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'forte-affluence':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'hors-service':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'maintenance':
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

function getStatusLabel(status: BorneStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'forte-affluence':
      return 'Forte affluence';
    case 'hors-service':
      return 'Hors service';
    case 'maintenance':
      return 'Maintenance';
  }
}

export function StationDetailPanel({ station, onClose, onUpdate }: StationDetailPanelProps) {
  const [selectedBorne, setSelectedBorne] = useState<Borne | null>(null);

  const handleSetMaintenance = (borneId: string) => {
    const updatedStation = {
      ...station,
      bornes: station.bornes.map((b) =>
        b.id === borneId ? { ...b, status: 'maintenance' as BorneStatus, currentCharge: 0 } : b
      ),
    };
    onUpdate(updatedStation);
    toast.success('Borne mise en maintenance');
  };

  const handleSetActive = (borneId: string) => {
    const updatedStation = {
      ...station,
      bornes: station.bornes.map((b) =>
        b.id === borneId ? { ...b, status: 'active' as BorneStatus } : b
      ),
    };
    onUpdate(updatedStation);
    toast.success('Borne réactivée');
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              {station.name}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{station.city}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Station Info */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Informations générales</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Statut station</span>
              <Badge
                variant="outline"
                className={
                  station.status === 'operational'
                    ? 'bg-emerald-50 text-emerald-700'
                    : station.status === 'degraded'
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-red-50 text-red-700'
                }
              >
                {station.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Bornes totales</span>
              <span className="font-semibold">{station.bornes.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-600 dark:text-gray-400">Taux d'occupation</span>
              <span className="font-semibold">{station.occupancy}%</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">Occupation</span>
              <span className="font-medium">{station.occupancy}%</span>
            </div>
            <Progress value={station.occupancy} className="h-2" />
          </div>
        </div>

        {/* Bornes List */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Liste des bornes</h3>
          <div className="space-y-2">
            {station.bornes.map((borne) => (
              <Card key={borne.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{borne.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Type: {borne.type} - {borne.power} kW
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(borne.status)}>
                      {getStatusLabel(borne.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {borne.type === 'solaire' && borne.batteryLevel !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1">
                            <Battery className="w-3 h-3" />
                            Batterie solaire
                          </span>
                          <span className="font-medium">{borne.batteryLevel}%</span>
                        </div>
                        <Progress value={borne.batteryLevel} className="h-1.5" />
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Utilisation
                        </span>
                        <span className="font-medium">{borne.currentCharge}%</span>
                      </div>
                      <Progress value={borne.currentCharge} className="h-1.5" />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      Dernier entretien: {new Date(borne.lastMaintenance).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedBorne(borne)}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{borne.name} - Historique</DialogTitle>
                          <DialogDescription>
                            Détails d'utilisation et maintenance
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Puissance
                              </span>
                              <span className="font-medium">{borne.power} kW</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Type
                              </span>
                              <span className="font-medium capitalize">{borne.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Statut actuel
                              </span>
                              <Badge variant="outline" className={getStatusColor(borne.status)}>
                                {getStatusLabel(borne.status)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="mb-2 font-medium">Historique récent:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• 15/01/2026 10:30 - Recharge véhicule électrique complétée</li>
                              <li>• 14/01/2026 16:45 - Maintenance préventive effectuée</li>
                              <li>• 13/01/2026 09:15 - Utilisation normale</li>
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {borne.status === 'active' || borne.status === 'forte-affluence' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetMaintenance(borne.id)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Wrench className="w-3 h-3 mr-1" />
                        Maintenance
                      </Button>
                    ) : borne.status === 'maintenance' || borne.status === 'hors-service' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetActive(borne.id)}
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        Réactiver
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
