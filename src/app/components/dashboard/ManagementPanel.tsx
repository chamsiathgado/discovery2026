import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Plus, Pencil, Trash2, MapPin, Zap, AlertCircle } from 'lucide-react';
import { Station, Borne, BorneStatus } from '@/app/data/mockData';
import { toast } from 'sonner';

interface ManagementPanelProps {
  stations: Station[];
  onStationUpdate: (station: Station) => void;
  onStationDelete: (stationId: string) => void;
  onStationAdd: (station: Station) => void;
}

export function ManagementPanel({
  stations,
  onStationUpdate,
  onStationDelete,
  onStationAdd,
}: ManagementPanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);

  // Form states for adding/editing stations
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('Cotonou');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormCity('Cotonou');
    setFormLat('');
    setFormLng('');
    setEditingStation(null);
  };

  const handleAddStation = () => {
    if (!formName || !formLat || !formLng) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const newStation: Station = {
      id: `NEW-${Date.now()}`,
      name: formName,
      city: formCity,
      position: [parseFloat(formLat), parseFloat(formLng)],
      bornes: [],
      occupancy: 0,
      status: 'operational',
    };

    onStationAdd(newStation);
    toast.success('Station créée avec succès');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setFormName(station.name);
    setFormCity(station.city);
    setFormLat(station.position[0].toString());
    setFormLng(station.position[1].toString());
  };

  const handleUpdateStation = () => {
    if (!editingStation || !formName || !formLat || !formLng) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const updatedStation: Station = {
      ...editingStation,
      name: formName,
      city: formCity,
      position: [parseFloat(formLat), parseFloat(formLng)],
    };

    onStationUpdate(updatedStation);
    toast.success('Station mise à jour');
    setEditingStation(null);
    resetForm();
  };

  const handleDeleteStation = (stationId: string, stationName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la station "${stationName}" ?`)) {
      onStationDelete(stationId);
      toast.success('Station supprimée');
    }
  };

  const handleBorneStatusChange = (stationId: string, borneId: string, newStatus: BorneStatus) => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) return;

    const updatedStation = {
      ...station,
      bornes: station.bornes.map((b) =>
        b.id === borneId ? { ...b, status: newStatus, currentCharge: newStatus === 'maintenance' ? 0 : b.currentCharge } : b
      ),
    };

    onStationUpdate(updatedStation);
    toast.success('Statut de la borne mis à jour');
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des stations et bornes
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            CRUD complet pour la gestion du réseau
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une station
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle station de recharge</DialogTitle>
              <DialogDescription>
                Ajouter une nouvelle station au réseau KEMET
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la station</Label>
                <Input
                  id="name"
                  placeholder="Station Plateau Cotonou"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Select value={formCity} onValueChange={setFormCity}>
                  <SelectTrigger id="city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cotonou">Cotonou</SelectItem>
                    <SelectItem value="Porto-Novo">Porto-Novo</SelectItem>
                    <SelectItem value="Parakou">Parakou</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    placeholder="6.3654"
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    placeholder="2.4183"
                    value={formLng}
                    onChange={(e) => setFormLng(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddStation} className="bg-emerald-600 hover:bg-emerald-700">
                Créer la station
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des stations ({stations.length})</CardTitle>
          <CardDescription>Gérer les stations et leurs bornes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Bornes</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucune station enregistrée
                  </TableCell>
                </TableRow>
              ) : (
                stations.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell className="font-mono text-xs">{station.id}</TableCell>
                    <TableCell className="font-medium">{station.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {station.city}
                      </div>
                    </TableCell>
                    <TableCell>{station.bornes.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              station.occupancy > 80
                                ? 'bg-red-500'
                                : station.occupancy > 50
                                ? 'bg-orange-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${station.occupancy}%` }}
                          />
                        </div>
                        <span className="text-sm">{station.occupancy}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          station.status === 'operational'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : station.status === 'degraded'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {station.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog
                          open={editingStation?.id === station.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditingStation(null);
                              resetForm();
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStation(station)}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier la station</DialogTitle>
                              <DialogDescription>
                                Mettre à jour les informations de la station
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Nom de la station</Label>
                                <Input
                                  value={formName}
                                  onChange={(e) => setFormName(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Ville</Label>
                                <Select value={formCity} onValueChange={setFormCity}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Cotonou">Cotonou</SelectItem>
                                    <SelectItem value="Porto-Novo">Porto-Novo</SelectItem>
                                    <SelectItem value="Parakou">Parakou</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Latitude</Label>
                                  <Input
                                    type="number"
                                    step="0.0001"
                                    value={formLat}
                                    onChange={(e) => setFormLat(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Longitude</Label>
                                  <Input
                                    type="number"
                                    step="0.0001"
                                    value={formLng}
                                    onChange={(e) => setFormLng(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingStation(null);
                                  resetForm();
                                }}
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={handleUpdateStation}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Mettre à jour
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteStation(station.id, station.name)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bornes Management */}
      {stations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gestion des bornes</CardTitle>
            <CardDescription>Modifier le statut des bornes individuellement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stations.map((station) => (
                <div key={station.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    {station.name} - {station.city}
                  </h4>
                  {station.bornes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucune borne enregistrée</p>
                  ) : (
                    <div className="space-y-2">
                      {station.bornes.map((borne) => (
                        <div
                          key={borne.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-sm">{borne.name}</p>
                              <p className="text-xs text-gray-500">
                                {borne.type} - {borne.power} kW
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={borne.status}
                              onValueChange={(value) =>
                                handleBorneStatusChange(station.id, borne.id, value as BorneStatus)
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="forte-affluence">Forte affluence</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="hors-service">Hors service</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
