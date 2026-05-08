# Portfolio Refactor Plan (Incremental)

## 1) Current Structure Analysis

Observed pain points in the current codebase:
- `src/libs/posts.ts` mixes data-source access (FS + MDX parsing), mapping, filtering and pagination orchestration.
- UI hooks/components (`src/hooks/useProjects.ts`, `src/components/Projects/*`) call data functions directly, which couples UI to data source details.
- `src/components` currently groups by page/section instead of Atomic Design hierarchy.
- Feature boundaries are implicit (projects/blog/cv), not explicit folders.

## 2) Target Folder Structure

```txt
src/
  app/                    # Next.js routing only
  entities/               # Pure domain model/types and domain rules
  features/
    projects/
      repositories/       # Data access for project content (MDX now, CMS later)
      use-cases/          # Business orchestration
      types/              # Feature-level query contracts
      components/         # (future) feature-specific UI if needed
  components/
    atoms/
    molecules/
    organisms/
  widgets/                # Composed sections (Hero, FeaturedProjects...)
  shared/                 # cross-feature hooks/utils/helpers
  lib/                    # framework/external integrations
```

## 3) Migration Plan (Step-by-step)

1. **Create core domain layer**
   - Add `entities/project.ts` as canonical domain type.
2. **Introduce feature module (`projects`)**
   - Add `features/projects/repositories/project.repository.ts` for MDX/FS data access.
   - Add `features/projects/use-cases/*` for application orchestration.
3. **Bridge legacy API**
   - Keep `src/libs/posts.ts` as compatibility adapter delegating to use-cases.
   - This avoids breaking existing pages/hooks during migration.
4. **Migrate UI consumption progressively**
   - Update hooks/components to import use-cases (or dedicated client API wrappers) instead of `libs` directly.
5. **Atomic Design extraction**
   - Decompose current `ProjectItem` into molecules and listing controls into organisms.
6. **Widget composition**
   - Move section-level assemblies (`Hero`, `Projects list section`, `Contact`) into `widgets/`.
7. **Route slimming**
   - Ensure routes in `app/` only orchestrate rendering and pass props/data.
8. **Repeat pattern for articles/cv**
   - Clone the same repository/use-case/entity flow for other domains.

## 4) Refactored Example (Projects Feature)

Implemented in this iteration:
- `src/entities/project.ts`
- `src/features/projects/types/project-query.ts`
- `src/features/projects/repositories/project.repository.ts`
- `src/features/projects/use-cases/get-projects.use-case.ts`
- `src/features/projects/use-cases/get-project-by-slug.use-case.ts`
- `src/libs/posts.ts` now delegates to use-cases (backward-compatible facade)

This gives the clean dependency chain:
**UI → use-cases → repository → MDX file system**.

## 5) Atomic Design Breakdown Example (Projects)

- **Atoms**
  - `Badge`, `Button`, `Heading`, `Text`
- **Molecules**
  - `ProjectCard` (title + desc + tags + thumbnail)
  - `CategoryChip`
- **Organisms**
  - `ProjectGrid`
  - `ProjectFilters`
  - `ProjectPaginationControls`
- **Widget**
  - `FeaturedProjectsSection`

## 6) Example: Clean Use-case + Repository Separation

Use-case:

```ts
export const getProjects = async (query: ProjectQuery): Promise<Project[]> => {
  return projectRepository.findPaginated(query);
};
```

Repository:

```ts
async findPaginated({ page, pageSize, categories }: ProjectQuery): Promise<Project[]> {
  let projects = await this.getAll();
  // filter + paginate over MDX-backed list
  return projects.slice(start, end);
}
```

Because the UI only depends on the use-case contract, replacing MDX by CMS only requires changing repository internals.
