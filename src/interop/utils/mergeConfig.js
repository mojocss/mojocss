/**
 * Merge new and default configs.
 * @class
 */
export default class MergeConfig {
    /**
     * @param {Object} config.
     * @param {Object} newConfig
     * @returns {Object}
     */
    constructor(config, newConfig) {
        if (newConfig !== undefined) {
            const mergeConfigs = (source, target) => {
                Object.keys(target).forEach((key) => {
                    if (source[key] instanceof Object && target[key] instanceof Object) {
                        if (source[key] instanceof Array && target[key] instanceof Array) {
                            source[key] = Array.from(new Set([...source[key], ...target[key]]));
                        } else if (!(source[key] instanceof Array) && !(target[key] instanceof Array)) {
                            mergeConfigs(source[key], target[key]);
                        } else {
                            source[key] = target[key];
                        }
                    } else {
                        source[key] = target[key];
                    }
                });
                return source;
            };

            mergeConfigs(config, newConfig);

            if (newConfig.base && newConfig.base.fonts && Object.keys(newConfig.base.fonts).length > 0) {
                config.base.fonts = newConfig.base.fonts;
            }

            config.base.breakpoints = Object.entries(config.base.breakpoints)
              .sort(([, a], [, b]) => parseInt(a.min) - parseInt(b.min))
              .sort(([, a], [, b]) => parseInt(b.max) - parseInt(a.max))
              .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        }

        return config;
    }
}
