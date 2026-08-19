// backend/src/ai/validator.js

const isObject = (value) =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);

const isArray = Array.isArray;

const isNonEmptyString = (value) =>
    typeof value === "string" &&
    value.trim().length > 0;

export const validateBlueprint = (data = {}) => {
    if (!isObject(data)) {
        throw new Error("Blueprint must be a JSON object.");
    }

    if (!isNonEmptyString(data.projectName)) {
        throw new Error("Blueprint is missing a valid 'projectName'.");
    }

    if (!isNonEmptyString(data.projectDescription) && !isNonEmptyString(data.overview)) {
        throw new Error("Blueprint is missing a valid 'projectDescription'.");
    }

    if (!isArray(data.features) || data.features.length === 0) {
        throw new Error("Blueprint must contain at least one feature.");
    }

    if (!isObject(data.technologyStack)) {
        throw new Error("Blueprint must contain a 'technologyStack' object.");
    }

    if (!isObject(data.architecture)) {
        throw new Error("Blueprint must contain an 'architecture' object.");
    }

    if (!isArray(data.databaseDesign) && !isArray(data.database)) {
        throw new Error("Blueprint must contain a 'databaseDesign' array.");
    }

    if (!isArray(data.restApis) && !isArray(data.apis)) {
        throw new Error("Blueprint must contain a 'restApis' array.");
    }

    if (!isArray(data.developmentRoadmap) && !isArray(data.roadmap)) {
        throw new Error("Blueprint must contain a 'developmentRoadmap' array.");
    }

    return true;
};

export default validateBlueprint;