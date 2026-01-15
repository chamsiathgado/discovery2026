import { Card } from '@/app/components/ui/card';
import { DollarSign, Shield, BarChart3, Leaf, Users, Zap } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Réduction des coûts opérationnels',
    description: 'Diminution de 25-35% des coûts de maintenance grâce à la prédiction et priorisation intelligente',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    icon: Shield,
    title: 'Amélioration de la fiabilité du réseau',
    description: 'Taux de disponibilité augmenté à 95%+ grâce à la détection précoce des anomalies',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: BarChart3,
    title: 'Pilotage basé sur la donnée',
    description: 'Décisions stratégiques éclairées par des analyses en temps réel et des prévisions IA',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Leaf,
    title: 'Contribution à la transition énergétique',
    description: 'Optimisation de la consommation et support de la croissance des véhicules électriques',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Users,
    title: 'Satisfaction des usagers',
    description: 'Meilleure expérience grâce à des bornes plus disponibles et fiables',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Zap,
    title: 'Déploiement stratégique',
    description: 'Identification des zones prioritaires pour l\'expansion du réseau basée sur l\'analyse de la demande',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

const journeySteps = [
  {
    step: '1',
    title: 'Connexion à la plateforme',
    description: 'Accès sécurisé via authentification multi-facteurs',
    color: 'bg-blue-500',
  },
  {
    step: '2',
    title: 'Consultation du tableau de bord',
    description: 'Vue d\'ensemble en temps réel de l\'état du réseau',
    color: 'bg-purple-500',
  },
  {
    step: '3',
    title: 'Prise de décision assistée par IA',
    description: 'Recommandations intelligentes et priorisation automatique',
    color: 'bg-emerald-500',
  },
  {
    step: '4',
    title: 'Génération de rapports institutionnels',
    description: 'Exports personnalisables pour les autorités de régulation',
    color: 'bg-orange-500',
  },
];

export function ValueProposition() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Parcours Administrateur */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-gray-900 mb-2">Parcours Administrateur Opérationnel</h2>
            <p className="text-gray-600">Un workflow quotidien simplifié et efficace</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {journeySteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="p-6 bg-white h-full">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white text-xl mb-4`}>
                    {item.step}
                  </div>
                  <h3 className="text-base text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Card>
                {index < journeySteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-0.5 bg-gray-300"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Valeur ajoutée */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-gray-900 mb-2">Valeur Ajoutée Mesurable pour les Institutions</h2>
            <p className="text-gray-600">Des bénéfices tangibles et quantifiables</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 rounded-lg ${benefit.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}