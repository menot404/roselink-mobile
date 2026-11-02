# Module chat RoseLink (prévention)

Copiez le contenu de ce dossier **dans la racine de `roselink-mobile`** (les chemins correspondent à `src/...`) :

```
src/features/chat/        moteur, base de connaissances, composants, auto-vérification
src/lib/use-keyboard-visible.ts
src/app/(tabs)/chat.tsx   remplace l'écran provisoire
```

## Modification à faire à la main : `src/components/navigation/floating-tab-bar.tsx`

Pour masquer la barre flottante quand le clavier est ouvert :

1. Ajoutez l'import : `import { useKeyboardVisible } from "@/lib/use-keyboard-visible";`
2. Dans le composant `FloatingTabBar`, après les autres hooks (`useSafeAreaInsets`, `useAppTheme`), ajoutez :

```tsx
const keyboardVisible = useKeyboardVisible();
if (keyboardVisible) return null;
```

(Cette ligne doit venir après tous les appels de hooks, jamais avant.)

## Vérifier la base de connaissances

En mode développement, l'écran Chat lance `selfCheck()` et affiche dans le terminal les problèmes éventuels
(suggestions non comprises, cas de test en échec). Pour ajouter un cas de test : `TEST_CASES` dans `selfcheck.ts`.

## Ajouter ou corriger une réponse

1. Choisir le fichier par thème dans `src/features/chat/knowledge/`.
2. Copier une intention existante : `id`, `keywords`, `reply`, `status`, `sources`, `followUps`.
3. Mots-clés : `"mot"`, `"expression exacte"`, `"racine*"` (début de mot). Les accents et la ponctuation sont ignorés.
4. Statut `"review"` tant qu'un professionnel de santé n'a pas validé. Passer à `"sourced"` seulement si une source officielle l'appuie.
5. Relancer l'application et lire le terminal.

## Après la relecture par un professionnel

Mettre `SHOW_REVIEW_BADGE` à `false` dans `config.ts` pour retirer la mention « en cours de relecture ».
