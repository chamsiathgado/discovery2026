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
  
  // Borne management states
  const [isAddBorneDialogOpen, setIsAddBorneDialogOpen] = useState(false);
  const [selectedStationForBorne, setSelectedStationForBorne] = useState<string | null>(null);
  const [editingBorne, setEditingBorne] = useState<Borne | null>(null);
  const [editingBorneStationId, setEditingBorneStationId] = useState<string | null>(null);

  // Form states for adding/editing stations
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('Cotonou');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');

  // Form states for adding/editing bornes
  const [borneName, setBorneName] = useState('');
  const [borneType, setBorneType] = useState<'standard' | 'rapide' | 'solaire'>('rapide');
  const [bornePower, setBornePower] = useState('22');
  const [borneBatteryLevel, setBorneBatteryLevel] = useState('');
  const [borneStatus, setBorneStatus] = useState<BorneStatus>('active');

  const resetForm = () => {
    setFormName('');
    setFormCity('Cotonou');
    setFormLat('');
    setFormLng('');
    setEditingStation(null);
  };

  const resetBorneForm = () => {
    setBorneName('');
    setBorneType('rapide');
    setBornePower('22');
    setBorneBatteryLevel('');
    setBorneStatus('active');
    setEditingBorne(null);
    setEditingBorneStationId(null);
    setSelectedStationForBorne(null);
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

  const handleAddBorne = () => {
    if (!selectedStationForBorne || !borneName || !bornePower) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (borneType === 'solaire' && !borneBatteryLevel) {
      toast.error('Le niveau de batterie est requis pour les bornes solaires');
      return;
    }

    const station = stations.find((s) => s.id === selectedStationForBorne);
    if (!station) return;

    const newBorne: Borne = {
      id: `B-${selectedStationForBorne}-${Date.now()}`,
      name: borneName,
      status: borneStatus,
      power: parseFloat(bornePower),
      batteryLevel: borneType === 'solaire' ? parseFloat(borneBatteryLevel) : undefined,
      currentCharge: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      type: borneType,
    };

    const updatedStation = {
      ...station,
      bornes: [...station.bornes, newBorne],
    };

    onStationUpdate(updatedStation);
    toast.success('Borne créée avec succès');
    setIsAddBorneDialogOpen(false);
    resetBorneForm();
  };

  const handleEditBorne = (stationId: string, borne: Borne) => {
    setEditingBorne(borne);
    setEditingBorneStationId(stationId);
    setSelectedStationForBorne(stationId);
    setBorneName(borne.name);
    setBorneType(borne.type);
    setBornePower(borne.power.toString());
    setBorneBatteryLevel(borne.batteryLevel?.toString() || '');
    setBorneStatus(borne.status);
  };

  const handleUpdateBorne = () => {
    if (!editingBorne || !editingBorneStationId || !borneName || !bornePower) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const station = stations.find((s) => s.id === editingBorneStationId);
    if (!station) return;

    const updatedStation = {
      ...station,
      bornes: station.bornes.map((b) =>
        b.id === editingBorne.id
          ? {
              ...b,
              name: borneName,
              type: borneType,
              power: parseFloat(bornePower),
              batteryLevel: borneType === 'solaire' ? parseFloat(borneBatteryLevel) : undefined,
              status: borneStatus,
            }
          : b
      ),
    };

    onStationUpdate(updatedStation);
    toast.success('Borne mise à jour');
    resetBorneForm();
  };

  const handleDeleteBorne = (stationId: string, borneId: string, borneName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la borne "${borneName}" ?`)) {
      const station = stations.find((s) => s.id === stationId);
      if (!station) return;

      const updatedStation = {
        ...station,
        bornes: station.bornes.filter((b) => b.id !== borneId),
      };

      onStationUpdate(updatedStation);
      toast.success('Borne supprimée');
    }
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestion des bornes</CardTitle>
                <CardDescription>CRUD complet pour les bornes de recharge</CardDescription>
              </div>
              <Dialog open={isAddBorneDialogOpen} onOpenChange={setIsAddBorneDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une borne
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nouvelle borne de recharge</DialogTitle>
                    <DialogDescription>
                      Ajouter une nouvelle borne à une station existante
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="station-select">Station *</Label>
                      <Select value={selectedStationForBorne || ''} onValueChange={setSelectedStationForBorne}>
                        <SelectTrigger id="station-select">
                          <SelectValue placeholder="Sélectionner une station" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} ({s.city})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="borne-name">Nom de la borne *</Label>
                      <Input
                        id="borne-name"
                        placeholder="Borne A1"
                        value={borneName}
                        onChange={(e) => setBorneName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="borne-type">Type *</Label>
                        <Select value={borneType} onValueChange={(v) => setBorneType(v as any)}>
                          <SelectTrigger id="borne-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard (11 kW)</SelectItem>
                            <SelectItem value="rapide">Rapide (22-50 kW)</SelectItem>
                            <SelectItem value="solaire">Solaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="borne-power">Puissance (kW) *</Label>
                        <Input
                          id="borne-power"
                          type="number"
                          step="0.1"
                          value={bornePower}
                          onChange={(e) => setBornePower(e.target.value)}
                        />
                      </div>
                    </div>
                    {borneType === 'solaire' && (
                      <div className="space-y-2">
                        <Label htmlFor="battery-level">Niveau de batterie (%) *</Label>
                        <Input
                          id="battery-level"
                          type="number"
                          min="0"
                          max="100"
                          value={borneBatteryLevel}
                          onChange={(e) => setBorneBatteryLevel(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="borne-status">Statut initial</Label>
                      <Select value={borneStatus} onValueChange={(v) => setBorneStatus(v as BorneStatus)}>
                        <SelectTrigger id="borne-status">
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
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddBorneDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddBorne} className="bg-emerald-600 hover:bg-emerald-700">
                      Créer la borne
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stations.map((station) => (
                <div key={station.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      {station.name} - {station.city}
                    </span>
                    <Badge variant="outline">{station.bornes.length} borne(s)</Badge>
                  </h4>
                  
                  {station.bornes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-4">Aucune borne enregistrée</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-white dark:bg-gray-900">
                            <TableHead>Nom</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Puissance</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Charge</TableHead>
                            <TableHead>Maintenance</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {station.bornes.map((borne) => (
                            <TableRow key={borne.id} className="bg-white dark:bg-gray-900">
                              <TableCell className="font-medium">{borne.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {borne.type}
                                  {borne.batteryLevel !== undefined && ` (${borne.batteryLevel}%)`}
                                </Badge>
                              </TableCell>
                              <TableCell>{borne.power} kW</TableCell>
                              <TableCell>
                                <Select
                                  value={borne.status}
                                  onValueChange={(value) =>
                                    handleBorneStatusChange(station.id, borne.id, value as BorneStatus)
                                  }
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="forte-affluence">Affluence</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="hors-service">H. service</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        borne.currentCharge > 80
                                          ? 'bg-red-500'
                                          : borne.currentCharge > 50
                                          ? 'bg-orange-500'
                                          : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${borne.currentCharge}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium min-w-[30px]">{borne.currentCharge}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs">{borne.lastMaintenance}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Dialog
                                    open={editingBorne?.id === borne.id}
                                    onOpenChange={(open) => {
                                      if (!open) resetBorneForm();
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditBorne(station.id, borne)}
                                      >
                                        <Pencil className="w-3 h-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Modifier la borne</DialogTitle>
                                        <DialogDescription>
                                          Mettre à jour les informations de la borne
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label>Nom de la borne</Label>
                                          <Input
                                            value={borneName}
                                            onChange={(e) => setBorneName(e.target.value)}
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select value={borneType} onValueChange={(v) => setBorneType(v as any)}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="standard">Standard</SelectItem>
                                                <SelectItem value="rapide">Rapide</SelectItem>
                                                <SelectItem value="solaire">Solaire</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label>Puissance (kW)</Label>
                                            <Input
                                              type="number"
                                              step="0.1"
                                              value={bornePower}
                                              onChange={(e) => setBornePower(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                        {borneType === 'solaire' && (
                                          <div className="space-y-2">
                                            <Label>Niveau de batterie (%)</Label>
                                            <Input
                                              type="number"
                                              min="0"
                                              max="100"
                                              value={borneBatteryLevel}
                                              onChange={(e) => setBorneBatteryLevel(e.target.value)}
                                            />
                                          </div>
                                        )}
                                        <div className="space-y-2">
                                          <Label>Statut</Label>
                                          <Select value={borneStatus} onValueChange={(v) => setBorneStatus(v as BorneStatus)}>
                                            <SelectTrigger>
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
                                      <DialogFooter>
                                        <Button
                                          variant="outline"
                                          onClick={() => resetBorneForm()}
                                        >
                                          Annuler
                                        </Button>
                                        <Button
                                          onClick={handleUpdateBorne}
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
                                    onClick={() => handleDeleteBorne(station.id, borne.id, borne.name)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
