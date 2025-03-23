export default {
    $schema: 'https://typedoc.org/schema.json',

    // #region Input
    entryPoints: ['./src/index.ts'],
    projectDocuments: ['./docs/index.md'],
    includeVersion: true,
    // #endregion

    // #region Output
    outputs: [
        {
            name: 'html',
            path: './type-doc',
            options: {
                navigation: {
                    includeCategories: true,
                    includeGroups: true,
                    excludeReferences: false,
                    includeFolders: false,
                },
            },
        },
    ],
    // out: 'type-doc',
    customFooterHtml: '<div>Copyright &copy; Kazuyoshi Matsumoto 2025</div>',
    lang: 'ja',
    categorizeByGroup: true,
    visibilityFilters: {
        protected: false,
        private: false,
        inherited: true,
        external: false,
        '@alpha': false,
        '@beta': false,
    },
    // #endregion
};
