import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Brain, AlertCircle, Lightbulb, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { aiRecommendations } from '@/app/data/mockData';
import { useState } from 'react';
import { toast } from 'sonner';

export function AIRecommendations() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const activeRecommendations = aiRecommendations.filter((r) => !dismissedIds.includes(r.id));

  const handleAction = (id: string, action: string) => {
    toast.success(`Action programmée: ${action}`);
    setDismissedIds((prev) => [...prev, id]);
  };

  const criticalRecs = activeRecommendations.filter((r) => r.type === 'critical');
  const warningRecs = activeRecommendations.filter((r) => r.type === 'warning');
  const suggestionRecs = activeRecommendations.filter((r) => r.type === 'suggestion');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Brain className="w-6 h-6" />
            Module d'Intelligence Artificielle
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Analyse prédictive et recommandations automatisées basées sur l'analyse des données d'usage en temps réel
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              Alertes critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{criticalRecs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Action immédiate requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-600">
              <AlertCircle className="w-4 h-4" />
              Avertissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{warningRecs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Attention requise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600">
              <Lightbulb className="w-4 h-4" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suggestionRecs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Optimisations possibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recommandations actives
        </h2>

        {activeRecommendations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Aucune recommandation active
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Toutes les alertes ont été traitées. Le système continue de surveiller le réseau.
              </p>
            </CardContent>
          </Card>
        ) : (
          activeRecommendations
            .sort((a, b) => a.priority - b.priority)
            .map((rec) => (
              <Alert
                key={rec.id}
                className={
                  rec.type === 'critical'
                    ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                    : rec.type === 'warning'
                    ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                }
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {rec.type === 'critical' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : rec.type === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${
                            rec.type === 'critical'
                              ? 'text-red-900 dark:text-red-100'
                              : rec.type === 'warning'
                              ? 'text-orange-900 dark:text-orange-100'
                              : 'text-blue-900 dark:text-blue-100'
                          }`}
                        >
                          {rec.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              rec.type === 'critical'
                                ? 'border-red-300 text-red-700'
                                : rec.type === 'warning'
                                ? 'border-orange-300 text-orange-700'
                                : 'border-blue-300 text-blue-700'
                            }`}
                          >
                            Priorité {rec.priority}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(rec.timestamp).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <AlertDescription
                      className={
                        rec.type === 'critical'
                          ? 'text-red-800 dark:text-red-200'
                          : rec.type === 'warning'
                          ? 'text-orange-800 dark:text-orange-200'
                          : 'text-blue-800 dark:text-blue-200'
                      }
                    >
                      {rec.description}
                    </AlertDescription>

                    <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                        Action recommandée: {rec.action}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(rec.id, rec.action)}
                        className={
                          rec.type === 'critical'
                            ? 'bg-red-600 hover:bg-red-700'
                            : rec.type === 'warning'
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Programmer l'action
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDismissedIds((prev) => [...prev, rec.id])}
                      >
                        Reporter
                      </Button>
                    </div>
                  </div>
                </div>
              </Alert>
            ))
        )}
      </div>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Analyse prédictive du réseau
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Tendances détectées
              </h4>
              <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                <li>• Augmentation de 15% de l'utilisation sur 7 jours</li>
                <li>• Pic d'utilisation stable entre 09h-12h</li>
                <li>• Demande croissante à Parakou (+22%)</li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Prévisions 30 jours
              </h4>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• Besoin estimé: +3 nouvelles bornes</li>
                <li>• Zone prioritaire: Cotonou (Étoile Rouge)</li>
                <li>• ROI prévisionnel: 18 mois</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
