import { faCode, faGears, faListCheck, faTerminal, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { DEPENDENCY_SCOPES } from "../../services/models/dependencies";

interface SCOPE_INFO {
  icon: IconDefinition,
  text: string,
}
export const DependencyScopeMapping: Record<DEPENDENCY_SCOPES, SCOPE_INFO> = {
  compile: { 
    icon: faTerminal,
    text: "Compile",
  },
  test: { 
    icon: faListCheck,
    text: "Test",
  },
  dependencies: { 
    icon: faGears,
    text: "Dependencies",
  },
  dependencymanagement: { 
    icon: faTerminal,
    text: "Dependency Mgmt.",
  },
  devDependencies: { 
    icon: faCode,
    text: "Dev",
  },
  development: { 
    icon: faCode,
    text: "Development",
  },
  import: { 
    icon: faCode,
    text: "Import",
  },
  provided: { 
    icon: faCode,
    text: "Provided",
  },
  require: { 
    icon: faCode,
    text: "Require",
  },
  runtime: { 
    icon: faGears,
    text: "Runtime",
  },
}