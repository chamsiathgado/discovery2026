import { Activity, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const kpiData = [
  { title: 'Taux de disponibilité', value: '94.2%', change: '+2.3%', icon: Activity, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  { title: 'Bornes actives', value: '1,247', change: '+156', icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Alertes en cours', value: '23', change: '-12', icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { title: 'Consommation (kWh)', value: '45,890', change: '+8.5%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

const availabilityData = [
  { mois: 'Juil', taux: 89 },
  { mois: 'Août', taux: 91 },
  { mois: 'Sept', taux: 88 },
  { mois: 'Oct', taux: 92 },
  { mois: 'Nov', taux: 93 },
  { mois: 'Déc', taux: 94.2 },
];

const energyData = [
  { zone: 'Lagos', consommation: 12500, prev: 11800 },
  { zone: 'Nairobi', consommation: 9800, prev: 9200 },
  { zone: 'Le Caire', consommation: 8700, prev: 8400 },
  { zone: 'Johannesburg', consommation: 7900, prev: 7300 },
  { zone: 'Accra', consommation: 6990, prev: 6500 },
];

const maintenanceData = [
  { jour: 'Lun', interventions: 12 },
  { jour: 'Mar', interventions: 8 },
  { jour: 'Mer', interventions: 15 },
  { jour: 'Jeu', interventions: 6 },
  { jour: 'Ven', interventions: 10 },
  { jour: 'Sam', interventions: 4 },
  { jour: 'Dim', interventions: 3 },
];

export function DashboardOverview() {
  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Tableau de Bord Central de Supervision</h2>
          <p className="text-gray-600">Vue d'ensemble en temps réel du réseau - Données collectées via capteurs IoT et API</p>
        </div>

        {/* KPIs */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="p-6 bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl text-gray-900 mb-1">{kpi.value}</p>
                    <p className={`text-sm ${kpi.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {kpi.change} vs mois dernier
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Taux de disponibilité */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg mb-4 text-gray-900">Évolution du taux de disponibilité</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={availabilityData}>
                <defs>
                  <linearGradient id="colorTaux" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mois" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[85, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="taux" stroke="#10b981" fillOpacity={1} fill="url(#colorTaux)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Consommation énergétique */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg mb-4 text-gray-900">Consommation énergétique par zone (kWh)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="zone" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="consommation" fill="#8b5cf6" name="Actuel" />
                <Bar dataKey="prev" fill="#d8b4fe" name="Précédent" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Interventions de maintenance */}
          <Card className="p-6 bg-white md:col-span-2">
            <h3 className="text-lg mb-4 text-gray-900">Interventions de maintenance - Dernière semaine</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="jour" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="interventions" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
}