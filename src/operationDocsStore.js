export default class OperationDocsStore {
  static getAll() {
    return `query MyQuery {
            heroes {
              description
              name
              id
              img
            }
          }
          `;
  }

  static addOne(name, desc, img = "") {
    return `mutation MyMutation {
        insert_heroes_one(object: {name: "${name}", description: "${desc}", img: "${img}"}) {
          name
          description
          img
        }
      }
      `;
  }

  static deleteByName(name) {
    return `mutation MyMutation {
      delete_heroes(where: {name: {_eq: "${name}"}}) {
        affected_rows
      }
    }
    `;
  }
}
