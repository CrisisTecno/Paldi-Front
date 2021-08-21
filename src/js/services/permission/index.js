import { attachTo } from "../../utils/attach"
import { buildGetFromObjectPath } from "../../utils/object_path"
import { permissionsMap } from "./permissionsMap"

const getFromPermissionsMap = buildGetFromObjectPath(permissionsMap)
const getPermissionValidator = (path) => getFromPermissionsMap(path)

const getDependencies = (callback) => angular.injector.$$annotate(callback)

angular.module('paldi-app').service('permissionService', function (

) {
  let permissions = {
  }
  let properties = {}
  let service = {}

  const getDependencyValidatorsHelper = (current, path) => {
    let validatorDependencies = {}
    for (const key of Object.keys(current)) {
      if (key.startsWith("$"))
        continue
      if (typeof current[key] === 'function') {
        validatorDependencies[`${path}.${key}`] = getDependencies(current[key])
        continue
      }
      validatorDependencies = { ...validatorDependencies, ...getDependencyValidatorsHelper(current[key], `${path}.${key}`) }
    }
    return validatorDependencies
  }

  service.getDependencyValidators = () => {
    let validatorDependencies = {}
    for (const key of Object.keys(permissionsMap)) {
      validatorDependencies = { ...validatorDependencies, ...getDependencyValidatorsHelper(permissionsMap[key], key) }
    }
    return validatorDependencies
  }

  service.refreshPermissions = () => {
    const dependencyMap = service.getDependencyValidators()
    for (const [path, dependencies] of Object.entries(dependencyMap)) {
      const canUpdate = dependencies.reduce((prev, current) => prev && !!properties[current], true)
      if (!canUpdate){
        attachTo(permissions, path, false)
        continue
      }
      const validatorArgs = dependencies.map(v => properties[v])
      const parent = getFromPermissionsMap(path.substr(0, path.lastIndexOf('.')))
      const allowed = getPermissionValidator(path).apply(parent,validatorArgs)
      attachTo(permissions, path, allowed)
    }
  }

  service.setDependency = (name, value) => {
    properties[name] = value
    service.refreshPermissions()
    return permissions
  }

  service.setDependencies = (dependencies) => {
    for (const [name, value] of dependencies) {
      properties[name] = value
    }
    service.refreshPermissions()
    return permissions
  }

  service.getPermissions = () => permissions

  return service
})

/*
user_roles: [
  "CONSULTANT", ->
  "MANAGER", ->
  "SALES_MANAGER", -> GERENTE DE VENTAS
  "INSTALLATION_MANAGER", -> GERENTE DE INSTALACIÓN
  "BUYER", ->
  "ADMIN", ->
  "SUPER_ADMIN" -> SUPER ADMIN
]
*/