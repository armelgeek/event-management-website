# CustomizableAdminView - Documentation

## Vue d'ensemble

`CustomizableAdminView` est une alternative flexible au composant `SimpleAdminPage` standard. Il permet de créer des interfaces d'administration personnalisées avec différents modes d'affichage et un contrôle total sur le rendu des éléments.

## Caractéristiques principales

- **Modes d'affichage multiples** : cards, list, grid, table, custom
- **Rendu personnalisé** : Contrôle total sur l'affichage de chaque élément
- **Basculement de vues** : Boutons pour changer de mode d'affichage
- **Actions CRUD** : Création, modification, suppression intégrées
- **Sélection multiple** : Support des actions bulk
- **Pagination** : Gestion automatique de la pagination

## Usage de base

```tsx
import { CustomizableAdminView, type ViewConfig } from '@/shared/components/atoms/ui/customizable-admin-view';
import { MonEntityAdminConfig } from '@/features/entity/entity.admin-config';
import { entitySchema } from '@/features/entity/entity.schema';

export default function CustomEntityPage() {
  const viewConfig: ViewConfig<Record<string, unknown>> = {
    mode: 'cards',
    gridConfig: {
      columns: 3,
      gap: 4,
      minItemWidth: '300px'
    },
    renderItem: (item, index, actions) => {
      // Votre rendu personnalisé ici
      const entity = item as Entity;
      return (
        <Card>
          <CardHeader>
            <CardTitle>{entity.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{entity.description}</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={actions.onEdit}>Modifier</Button>
              <Button onClick={actions.onDelete}>Supprimer</Button>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <CustomizableAdminView
      config={MonEntityAdminConfig}
      schema={entitySchema}
      viewConfig={viewConfig}
    />
  );
}
```

## Configuration des vues

### Interface ViewConfig

```tsx
interface ViewConfig<T> {
  mode: ViewMode; // 'table' | 'cards' | 'list' | 'grid' | 'custom'
  renderItem?: (item: T, index: number, actions: ItemActions) => React.ReactNode;
  renderCustomView?: (props: RenderProps<T>) => React.ReactNode;
  gridConfig?: GridConfig;
  listConfig?: ListConfig;
}
```

### Modes d'affichage

#### 1. Mode Cards
```tsx
const viewConfig: ViewConfig<Entity> = {
  mode: 'cards',
  gridConfig: {
    columns: 3,        // Nombre de colonnes
    gap: 4,           // Espacement (en unités Tailwind)
    minItemWidth: '280px' // Largeur minimum des cartes
  },
  renderItem: (item, index, actions) => (
    // Votre rendu de carte personnalisé
  )
};
```

#### 2. Mode List
```tsx
const viewConfig: ViewConfig<Entity> = {
  mode: 'list',
  listConfig: {
    showThumbnail: true,
    showStatus: true,
    showActions: true
  },
  renderItem: (item, index, actions) => (
    // Votre rendu de ligne personnalisé
  )
};
```

#### 3. Mode Custom complet
```tsx
const viewConfig: ViewConfig<Entity> = {
  mode: 'custom',
  renderCustomView: ({ items, isLoading, error, selectedItems, onSelectItem, onEditItem, onDeleteItem, meta }) => (
    // Votre interface complètement personnalisée
    <div className="custom-layout">
      {items.map(item => (
        <MyCustomComponent 
          key={item.id} 
          item={item}
          onEdit={() => onEditItem(item)}
          onDelete={() => onDeleteItem(item)}
        />
      ))}
    </div>
  )
};
```

## Actions disponibles

Chaque item dispose des actions suivantes via le paramètre `actions` :

```tsx
interface ItemActions {
  onEdit: () => void;       // Ouvrir le formulaire d'édition
  onDelete: () => void;     // Ouvrir la confirmation de suppression
  onSelect: (selected: boolean) => void; // Sélectionner/désélectionner l'item
  isSelected: boolean;      // État de sélection actuel
}
```

## Exemple complet : Page Events Custom

Voir `/app/(admin)/admin/events-custom/page.tsx` pour un exemple concret d'utilisation avec :
- Rendu de cartes personnalisées avec images
- Gestion des dates et localisations
- Actions conditionnelles selon la configuration
- Gestion de la sélection multiple

## Différences avec SimpleAdminPage

| Fonctionnalité | SimpleAdminPage | CustomizableAdminView |
|----------------|-----------------|----------------------|
| Mode d'affichage | Table uniquement | Cards, List, Grid, Custom |
| Rendu des items | Auto-généré | Entièrement personnalisable |
| Basculement vues | Non | Oui |
| Flexibilité layout | Limitée | Totale |
| Complexité | Simple | Avancée |

## Quand utiliser CustomizableAdminView

- **Interface visuelle riche** : Quand vous voulez des cartes, des grilles ou des layouts personnalisés
- **Données complexes** : Quand vos entités ont des champs visuels (images, statuts colorés, etc.)
- **UX spécifique** : Quand l'UX métier nécessite un rendu particulier
- **Basculement de vues** : Quand les utilisateurs ont besoin de différentes vues sur les mêmes données

## Quand utiliser SimpleAdminPage

- **CRUD simple** : Pour des entités basiques avec peu de champs
- **Développement rapide** : Quand vous voulez une interface admin générée automatiquement
- **Données tabulaires** : Quand les données se prêtent bien à un affichage en tableau

## Tips & Bonnes pratiques

1. **Performance** : Utilisez React.memo() pour vos composants de rendu personnalisé
2. **Accessibilité** : N'oubliez pas les attributs ARIA dans vos rendus personnalisés
3. **Responsivité** : Adaptez les `gridConfig.columns` selon les breakpoints
4. **État** : Gardez l'état local au minimum, laissez CustomizableAdminView gérer les sélections et modals
5. **Types** : Utilisez `Record<string, unknown>` pour la compatibilité, puis castez vers votre type spécifique

## Exemple de navigation entre modes

```tsx
// Vous pouvez aussi gérer le changement de mode depuis l'extérieur
const [currentMode, setCurrentMode] = useState<ViewMode>('cards');

const viewConfig: ViewConfig<Entity> = {
  mode: currentMode,
  // ... autres configs
};

return (
  <CustomizableAdminView
    config={EntityAdminConfig}
    schema={entitySchema}
    viewConfig={viewConfig}
    onViewModeChange={setCurrentMode}
  />
);
```

Cette approche vous donne une flexibilité maximale pour créer des interfaces d'administration sur-mesure tout en conservant toute la puissance du système CRUD intégré.
