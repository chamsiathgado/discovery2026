import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, Clock, Zap, Wrench } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'critical',
    category: 'panne',
    title: 'Panne critique - Station Lagos Centre',
    description: '3 bornes hors service depuis 2h. Intervention requise immédiatement.',
    time: 'Il y a 15 min',
    station: 'Lagos Centre',
    priority: 'Haute',
  },
  {
    id: 2,
    type: 'warning',
    category: 'surcharge',
    title: 'Surcharge réseau - Zone Nairobi',
    description: 'Utilisation à 95%. Risque de surcharge si la demande augmente.',
    time: 'Il y a 32 min',
    station: 'Nairobi Est',
    priority: 'Moyenne',
  },
  {
    id: 3,
    type: 'info',
    category: 'maintenance',
    title: 'Maintenance planifiée - Johannesburg Sud',
    description: 'Intervention de maintenance préventive programmée demain à 08h00.',
    time: 'Il y a 1h',
    station: 'Johannesburg Sud',
    priority: 'Basse',
  },
  {
    id: 4,
    type: 'warning',
    category: 'inactivité',
    title: 'Inactivité prolongée - Station Addis-Abeba',
    description: 'Aucune activité détectée depuis 6 heures. Vérification recommandée.',
    time: 'Il y a 2h',
    station: 'Addis-Abeba',
    priority: 'Moyenne',
  },
  {
    id: 5,
    type: 'critical',
    category: 'panne',
    title: 'Défaillance système - Station Accra Ouest',
    description: 'Système de communication HS. Données temps réel indisponibles.',
    time: 'Il y a 3h',
    station: 'Accra Ouest',
    priority: 'Haute',
  },
];

const getAlertConfig = (type: string) => {
  switch (type) {
    case 'critical':
      return { color: 'bg-red-100 border-red-300', textColor: 'text-red-800', icon: AlertTriangle, iconColor: 'text-red-600' };
    case 'warning':
      return { color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800', icon: AlertCircle, iconColor: 'text-orange-600' };
    case 'info':
      return { color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800', icon: Info, iconColor: 'text-blue-600' };
    default:
      return { color: 'bg-gray-100 border-gray-300', textColor: 'text-gray-800', icon: Info, iconColor: 'text-gray-600' };
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'panne':
      return Zap;
    case 'surcharge':
      return AlertCircle;
    case 'maintenance':
      return Wrench;
    case 'inactivité':
      return Clock;
    default:
      return Info;
  }
};

export function AlertsSystem() {
  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;

  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Système d'Alertes Basé sur Seuils Opérationnels</h2>
          <p className="text-gray-600">Règles paramétrables et notifications automatiques - Pas de boîte noire</p>
        </div>

        {/* Alert Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Alertes critiques</p>
                <p className="text-3xl text-gray-900">{criticalCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avertissements</p>
                <p className="text-3xl text-gray-900">{warningCount}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>
          </Card>
          <Card className="p-6 bg-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Informations</p>
                <p className="text-3xl text-gray-900">{infoCount}</p>
              </div>
              <Info className="w-10 h-10 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Alerts List */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg mb-4 text-gray-900">Alertes en cours</h3>
          <div className="space-y-4">
            {alerts.map((alert) => {
              const config = getAlertConfig(alert.type);
              const Icon = config.icon;
              const CategoryIcon = getCategoryIcon(alert.category);
              
              return (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${config.color} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`text-base ${config.textColor}`}>{alert.title}</h4>
                        <Badge
                          variant="outline"
                          className={`ml-2 ${
                            alert.priority === 'Haute'
                              ? 'border-red-400 text-red-700'
                              : alert.priority === 'Moyenne'
                              ? 'border-orange-400 text-orange-700'
                              : 'border-blue-400 text-blue-700'
                          }`}
                        >
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className={`text-sm mb-3 ${config.textColor}`}>{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className={`w-3 h-3 ${config.iconColor}`} />
                          <span className={config.textColor}>{alert.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CategoryIcon className={`w-3 h-3 ${config.iconColor}`} />
                          <span className={config.textColor}>{alert.station}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  );
}