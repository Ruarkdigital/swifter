{
  "openapi": "3.0.0",
  "info": {
    "title": "SwiftPro REST API Docs",
    "version": "2.3.0",
    "description": "SwiftPro REST API docs for dev server - This docs is mainly for itegration and testing"
  },
  "servers": [
    {
      "url": "http://localhost:10001/api/v1/contract",
      "desription": "Local server testing"
    },
    {
      "url": "https://dev.swiftpro.tech/api/v1/dev/contract",
      "description": "Development server for testing and integration"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "CreateContractInput": {
        "type": "object",
        "required": [
          "title",
          "description",
          "category",
          "timezone",
          "contractType",
          "contractRelationship"
        ],
        "properties": {
          "projectId": {
            "type": "string",
            "description": "Project ID when contractRelationship is 'project'"
          },
          "msaContractId": {
            "type": "string",
            "description": "MSA Contract ID when contractRelationship is 'msa_project'"
          },
          "solicitationId": {
            "type": "string",
            "description": "Link to an awarded solicitation"
          },
          "contractType": {
            "type": "string",
            "description": "Contract type ID"
          },
          "timezone": {
            "type": "string"
          },
          "contractPaymentTerm": {
            "type": "string",
            "description": "Contract payment term ID"
          },
          "contractTermType": {
            "type": "string",
            "description": "Contract term type ID"
          },
          "title": {
            "type": "string"
          },
          "contractRelationship": {
            "type": "string",
            "enum": [
              "standalone",
              "project",
              "msa_project"
            ]
          },
          "category": {
            "type": "string"
          },
          "contractId": {
            "type": "string",
            "description": "Optional external ID"
          },
          "description": {
            "type": "string"
          },
          "jobTitle": {
            "type": "string"
          },
          "vendor": {
            "type": "string",
            "description": "Vendor ObjectId or email"
          },
          "personnel": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "role": {
                  "type": "string"
                },
                "email": {
                  "type": "string",
                  "format": "email"
                },
                "phone": {
                  "type": "string"
                }
              }
            }
          },
          "internalTeam": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "List of internal user IDs"
          },
          "visibility": {
            "type": "string",
            "enum": [
              "public",
              "private"
            ],
            "default": "private"
          },
          "contractAmount": {
            "type": "number"
          },
          "contigency": {
            "type": "string"
          },
          "holdBack": {
            "type": "number"
          },
          "paymentTerm": {
            "type": "string"
          },
          "startDate": {
            "type": "string",
            "format": "date"
          },
          "endDate": {
            "type": "string",
            "format": "date"
          },
          "duration": {
            "type": "number"
          },
          "termType": {
            "type": "string"
          },
          "deliverables": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "dueDate": {
                  "type": "string",
                  "format": "date"
                }
              }
            }
          },
          "milestone": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "amount": {
                  "type": "number"
                },
                "dueDate": {
                  "type": "string",
                  "format": "date"
                },
                "name": {
                  "type": "string"
                }
              }
            }
          },
          "files": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "url": {
                  "type": "string",
                  "format": "uri"
                },
                "type": {
                  "type": "string"
                },
                "size": {
                  "type": "number"
                }
              }
            }
          },
          "approvals": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "user": {
                  "type": "string"
                },
                "groupName": {
                  "type": "string"
                },
                "levelName": {
                  "type": "number",
                  "minimum": 1,
                  "maximum": 5
                }
              }
            }
          }
        }
      },
      "Contract": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "contractRelationship": {
            "type": "string",
            "enum": [
              "standalone",
              "project",
              "msa_project"
            ]
          },
          "status": {
            "type": "string",
            "enum": [
              "draft",
              "pending_approval",
              "active",
              "completed",
              "cancelled",
              "expired",
              "terminated"
            ]
          },
          "deliverables": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "dueDate": {
                  "type": "string",
                  "format": "date-time"
                }
              }
            }
          },
          "files": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "url": {
                  "type": "string"
                },
                "type": {
                  "type": "string"
                },
                "size": {
                  "type": "string"
                }
              }
            }
          },
          "approvals": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          },
          "company": {
            "type": "string"
          },
          "project": {
            "type": "string"
          },
          "vendor": {
            "type": "string"
          },
          "creator": {
            "type": "string"
          },
          "contractType": {
            "type": "string",
            "enum": [
              "hourly",
              "fixed",
              "milestone"
            ]
          },
          "currency": {
            "type": "string",
            "example": "USD"
          },
          "ratePerHour": {
            "type": "number"
          },
          "totalAmount": {
            "type": "number"
          },
          "startDate": {
            "type": "string",
            "format": "date-time"
          },
          "endDate": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "ApiResponseContract": {
        "type": "object",
        "properties": {
          "status": {
            "type": "integer",
            "example": 201
          },
          "message": {
            "type": "string",
            "example": "Contract created successfully"
          },
          "data": {
            "$ref": "#/components/schemas/Contract"
          }
        }
      },
      "ApiResponseContractList": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Project contracts fetched successfully"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Contract"
            }
          }
        }
      },
      "ApiResponseContractStats": {
        "type": "object",
        "properties": {
          "status": {
            "type": "integer",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Contract stats fetched successfully"
          },
          "data": {
            "type": "object",
            "properties": {
              "all": {
                "type": "integer"
              },
              "draft": {
                "type": "integer"
              },
              "pending_approval": {
                "type": "integer"
              },
              "active": {
                "type": "integer"
              },
              "completed": {
                "type": "integer"
              },
              "suspended": {
                "type": "integer"
              },
              "expired": {
                "type": "integer"
              },
              "terminated": {
                "type": "integer"
              }
            }
          }
        }
      },
      "CreateProjectInput": {
        "type": "object",
        "required": [
          "name",
          "category",
          "description",
          "budget",
          "allowMultiple"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "Project name",
            "example": "School Renovation"
          },
          "category": {
            "type": "string",
            "description": "Project category or domain",
            "example": "Education"
          },
          "description": {
            "type": "string",
            "description": "Detailed explanation of the project scope",
            "example": "Renovation of central school blocks"
          },
          "startDate": {
            "type": "string",
            "format": "date",
            "description": "Optional start date (ISO 8601)",
            "example": "2026-01-15"
          },
          "endDate": {
            "type": "string",
            "format": "date",
            "description": "Optional end date (ISO 8601)",
            "example": "2026-09-30"
          },
          "budget": {
            "type": "number",
            "description": "Allocated budget for the project",
            "example": 1200000
          },
          "allowMultiple": {
            "type": "boolean",
            "description": "Whether multiple contracts are allowed under this project",
            "example": true
          },
          "files": {
            "type": "array",
            "description": "Optional list of associated file metadata",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "url": {
                  "type": "string",
                  "format": "uri"
                },
                "type": {
                  "type": "string"
                },
                "size": {
                  "type": "number"
                }
              }
            }
          }
        }
      },
      "Project": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "company": {
            "type": "string"
          },
          "creator": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "startDate": {
            "type": "string",
            "format": "date-time"
          },
          "endDate": {
            "type": "string",
            "format": "date-time"
          },
          "budget": {
            "type": "number"
          },
          "status": {
            "type": "string",
            "enum": [
              "active",
              "completed",
              "cancelled"
            ]
          },
          "allowMultiple": {
            "type": "boolean"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "ApiResponseProject": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 201
          },
          "message": {
            "type": "string",
            "example": "Project created successfully"
          },
          "data": {
            "$ref": "#/components/schemas/Project"
          }
        }
      },
      "ErrorResponse": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "example": "error"
          },
          "message": {
            "type": "string",
            "example": "Something went wrong"
          }
        }
      },
      "ApiResponseProjectList": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Projects fetched successfully"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/Project"
            }
          }
        }
      },
      "ProjectStats": {
        "type": "object",
        "properties": {
          "all": {
            "type": "number"
          },
          "active": {
            "type": "number"
          },
          "completed": {
            "type": "number"
          },
          "cancelled": {
            "type": "number"
          }
        }
      },
      "ApiResponseProjectStats": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Project stats fetched successfully"
          },
          "data": {
            "$ref": "#/components/schemas/ProjectStats"
          }
        }
      },
      "AuthenticatedError": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 401
          },
          "message": {
            "type": "string",
            "example": "User not authenticated"
          }
        }
      },
      "NotFoundError": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 404
          },
          "message": {
            "type": "string",
            "example": "Not Found"
          }
        }
      },
      "DuplicateError": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 409
          },
          "message": {
            "type": "string",
            "example": "Duplicate entry"
          }
        }
      },
      "ValidationError": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 422
          },
          "message": {
            "type": "string",
            "example": "Validation failed"
          }
        }
      },
      "ServerError": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 500
          },
          "message": {
            "type": "string",
            "example": "Internal server error"
          }
        }
      },
      "AuthorizeError": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 403
          },
          "message": {
            "type": "string",
            "example": "Unauthorized"
          }
        }
      },
      "BadRequest": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 400
          },
          "message": {
            "type": "string",
            "example": "Bad request"
          }
        }
      },
      "ContractType": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        }
      },
      "ContractPaymentTerm": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        }
      },
      "ContractTermType": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        }
      },
      "AwardedVendorItem": {
        "type": "object",
        "properties": {
          "solicitationId": {
            "type": "string"
          },
          "solicitationName": {
            "type": "string"
          },
          "vendor": {
            "type": "object",
            "properties": {
              "_id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "email": {
                "type": "string"
              }
            }
          }
        }
      },
      "UserBasic": {
        "type": "object",
        "properties": {
          "_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          }
        }
      },
      "ApiResponseContractTypeList": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Contract types fetched successfully"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ContractType"
            }
          }
        }
      },
      "ApiResponseContractPaymentTermList": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Contract payment terms fetched successfully"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ContractPaymentTerm"
            }
          }
        }
      },
      "ApiResponseContractTermTypeList": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Contract terms fetched successfully"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ContractTermType"
            }
          }
        }
      },
      "ApiResponseAwardedVendorList": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Awarded solicitation vendors fetched successfully"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/AwardedVendorItem"
            }
          }
        }
      },
      "ApiResponseUserList": {
        "type": "object",
        "properties": {
          "status": {
            "type": "number",
            "example": 200
          },
          "message": {
            "type": "string",
            "example": "Contract personnel fetched successfully"
          },
          "data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/UserBasic"
            }
          }
        }
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "paths": {
    "/projects": {
      "get": {
        "summary": "List projects",
        "description": "Returns projects belonging to the authenticated user's company. Supports filtering and pagination.",
        "tags": [
          "Project"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "name",
            "schema": {
              "type": "string",
              "enum": [
                "draft",
                "pending_approval",
                "active",
                "completed",
                "suspended",
                "expired",
                "terminated"
              ]
            },
            "description": "Case-insensitive partial match by project name"
          },
          {
            "in": "query",
            "name": "date",
            "schema": {
              "type": "string",
              "format": "date"
            },
            "description": "Return projects having `startDate \u003E= date` (ISO 8601)"
          },
          {
            "in": "query",
            "name": "status",
            "schema": {
              "type": "string",
              "format": "date",
              "enum": [
                "active",
                "completed",
                "cancelled"
              ]
            },
            "description": "Filter by project status"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 10
            },
            "description": "Page size"
          },
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            },
            "description": "Page number"
          }
        ],
        "responses": {
          "200": {
            "description": "Projects fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseProjectList"
                },
                "examples": {
                  "list": {
                    "value": {
                      "status": 200,
                      "message": "Projects fetched successfully",
                      "data": [
                        {
                          "_id": "671c2f0d9f4e2b0012345678",
                          "company": "66fb1c7a8d2eaa0012345678",
                          "creator": "66fb1c7a8d2eaa0098765432",
                          "name": "School Renovation",
                          "category": "Education",
                          "description": "Renovation of central school blocks",
                          "startDate": "2026-01-15T00:00:00.000Z",
                          "endDate": "2026-09-30T00:00:00.000Z",
                          "budget": 1200000,
                          "status": "active",
                          "allowMultiple": true,
                          "createdAt": "2026-01-01T10:30:22.000Z",
                          "updatedAt": "2026-01-01T10:30:22.000Z"
                        },
                        {
                          "_id": "671c2f0d9f4e2b0099999999",
                          "company": "66fb1c7a8d2eaa0012345678",
                          "creator": "66fb1c7a8d2eaa0098765432",
                          "name": "New Municipality Road",
                          "category": "Infrastructure",
                          "description": "Road construction in district A",
                          "startDate": "2026-02-01T00:00:00.000Z",
                          "budget": 2500000,
                          "status": "active",
                          "allowMultiple": false,
                          "createdAt": "2026-02-01T09:10:00.000Z",
                          "updatedAt": "2026-02-01T09:10:00.000Z"
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a new project",
        "description": "Creates a project within the authenticated user's company. Only `procurement` and `contract_manager` roles are allowed. Supports optional `startDate`, `endDate`, and `files`.",
        "tags": [
          "Project"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "procurement",
          "contract_manager"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateProjectInput"
              },
              "examples": {
                "basic": {
                  "summary": "Minimal valid project (no dates/files)",
                  "value": {
                    "name": "New Municipality Road",
                    "category": "Infrastructure",
                    "description": "Road construction in district A",
                    "budget": 2500000,
                    "allowMultiple": false
                  }
                },
                "withDates": {
                  "summary": "Project with start and end dates",
                  "value": {
                    "name": "School Renovation",
                    "category": "Education",
                    "description": "Renovation of central school blocks",
                    "startDate": "2026-01-15",
                    "endDate": "2026-09-30",
                    "budget": 1200000,
                    "allowMultiple": true
                  }
                },
                "withFiles": {
                  "summary": "Project payload including files metadata",
                  "value": {
                    "name": "Bridge Maintenance",
                    "category": "Infrastructure",
                    "description": "Routine maintenance and inspection",
                    "budget": 500000,
                    "allowMultiple": false,
                    "files": [
                      {
                        "name": "specifications.pdf",
                        "url": "https://example.com/files/specifications.pdf",
                        "type": "application/pdf",
                        "size": 1048576
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Project created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseProject"
                },
                "examples": {
                  "created": {
                    "value": {
                      "status": 201,
                      "message": "Project created successfully",
                      "data": {
                        "_id": "671c2f0d9f4e2b0012345678",
                        "company": "66fb1c7a8d2eaa0012345678",
                        "creator": "66fb1c7a8d2eaa0098765432",
                        "name": "School Renovation",
                        "category": "Education",
                        "description": "Renovation of central school blocks",
                        "startDate": "2026-01-15T00:00:00.000Z",
                        "endDate": "2026-09-30T00:00:00.000Z",
                        "budget": 1200000,
                        "status": "active",
                        "allowMultiple": true,
                        "createdAt": "2026-01-01T10:30:22.000Z",
                        "updatedAt": "2026-01-01T10:30:22.000Z"
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                },
                "examples": {
                  "unauthenticated": {
                    "value": {
                      "status": "error",
                      "message": "Unauthenticated user"
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                },
                "examples": {
                  "forbidden": {
                    "value": {
                      "status": "error",
                      "message": "Access denied"
                    }
                  }
                }
              }
            }
          },
          "409": {
            "description": "Duplicate entry detected",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DuplicateError"
                },
                "examples": {
                  "duplicate": {
                    "value": {
                      "status": "error",
                      "message": "Duplicate entry: name with value \"School Renovation\" already exists"
                    }
                  }
                }
              }
            }
          },
          "422": {
            "description": "Validation error (zod/mongoose)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ValidationError"
                },
                "examples": {
                  "zod": {
                    "value": {
                      "status": "error",
                      "message": "Validation Error - name - Required. budget - Expected number."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/types": {
      "get": {
        "summary": "List contract types",
        "description": "Returns all contract types available.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "responses": {
          "200": {
            "description": "Contract types fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContractTypeList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/payment-terms": {
      "get": {
        "summary": "List contract payment terms",
        "description": "Returns all supported contract payment terms.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "responses": {
          "200": {
            "description": "Contract payment terms fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContractPaymentTermList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/terms": {
      "get": {
        "summary": "List contract term types",
        "description": "Returns all contract term types.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "responses": {
          "200": {
            "description": "Contract terms fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContractTermTypeList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/awarded-solicitation": {
      "get": {
        "summary": "List awarded vendors without contracts",
        "description": "Returns awarded vendors for solicitations in the company that have not been linked to any contract.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "procurement",
          "contract_manager"
        ],
        "responses": {
          "200": {
            "description": "Awarded solicitation vendors fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseAwardedVendorList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/personnel": {
      "get": {
        "summary": "List contract personnel",
        "description": "Returns users in the company eligible for contract-related roles.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "procurement",
          "contract_manager"
        ],
        "responses": {
          "200": {
            "description": "Contract personnel fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseUserList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/contracts": {
      "post": {
        "summary": "Create a new contract",
        "description": "Creates a contract within the authenticated user's company. Only `procurement` and `contract_manager` roles are allowed.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "procurement",
          "contract_manager"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateContractInput"
              },
              "examples": {
                "basic": {
                  "summary": "Minimal valid contract",
                  "value": {
                    "title": "Janitorial Services",
                    "description": "Routine office cleaning services",
                    "category": "Facilities",
                    "timezone": "America/New_York",
                    "contractType": "671c2f0d9f4e2b0012345678",
                    "contractRelationship": "standalone"
                  }
                },
                "withProject": {
                  "summary": "Contract under a project",
                  "value": {
                    "title": "School Renovation Works",
                    "description": "Interior and exterior renovation",
                    "category": "Construction",
                    "timezone": "America/Chicago",
                    "contractType": "671c2f0d9f4e2b0012345678",
                    "contractRelationship": "project",
                    "projectId": "66fb1c7a8d2eaa0012345678",
                    "allowMultiple": true
                  }
                },
                "withVendorAndFiles": {
                  "summary": "Contract with vendor, deliverables, files",
                  "value": {
                    "title": "Bridge Inspection",
                    "description": "Routine inspection of municipal bridges",
                    "category": "Infrastructure",
                    "timezone": "America/Los_Angeles",
                    "contractType": "671c2f0d9f4e2b0012345678",
                    "paymentTerm": "671c2f0d9f4e2b0099999999",
                    "contractRelationship": "standalone",
                    "vendor": "vendor@example.com",
                    "personnel": [
                      {
                        "name": "Jane Doe",
                        "role": "Supervisor",
                        "email": "jane.doe@example.com",
                        "phone": "+1-555-0101"
                      }
                    ],
                    "deliverables": [
                      {
                        "name": "Initial Report",
                        "dueDate": "2026-02-15"
                      }
                    ],
                    "files": [
                      {
                        "name": "scope.pdf",
                        "url": "https://example.com/scope.pdf",
                        "type": "application/pdf",
                        "size": 123456
                      }
                    ]
                  }
                },
                "withMilestone": {
                  "summary": "Contract with milestones (amount, due date, name)",
                  "value": {
                    "title": "Road Repair",
                    "description": "Patching and resurfacing",
                    "category": "Infrastructure",
                    "timezone": "America/New_York",
                    "contractType": "671c2f0d9f4e2b0012345678",
                    "contractRelationship": "standalone",
                    "milestone": [
                      {
                        "amount": 250000,
                        "dueDate": "2026-03-01",
                        "name": "Phase 1 Completion"
                      },
                      {
                        "amount": 150000,
                        "dueDate": "2026-05-15",
                        "name": "Final Delivery"
                      }
                    ]
                  }
                },
                "withApprovals": {
                  "summary": "Contract with approvals (levels 1-5)",
                  "value": {
                    "title": "IT Equipment Supply",
                    "description": "Supply of laptops and accessories",
                    "category": "IT",
                    "timezone": "UTC",
                    "contractType": "671c2f0d9f4e2b0012345678",
                    "contractRelationship": "standalone",
                    "approvals": [
                      {
                        "user": "approver1@example.com",
                        "groupName": "Group 1",
                        "levelName": 1
                      },
                      {
                        "user": "approver2@example.com",
                        "groupName": "Group 2",
                        "levelName": 2
                      }
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Contract created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContract"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "422": {
            "description": "Validation error (zod/mongoose)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ValidationError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "List contracts",
        "description": "Returns contracts belonging to the authenticated user's company.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "responses": {
          "200": {
            "description": "Contracts fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContractList"
                },
                "examples": {
                  "list": {
                    "value": {
                      "status": 200,
                      "message": "Contracts fetched successfully",
                      "data": [
                        {
                          "_id": "671c2f0d9f4e2b0012345678",
                          "title": "Bridge Inspection",
                          "description": "Routine inspection of municipal bridges",
                          "category": "Infrastructure",
                          "contractRelationship": "standalone",
                          "status": "active",
                          "deliverables": [
                            {
                              "name": "Initial Report",
                              "dueDate": "2026-02-15T00:00:00.000Z"
                            }
                          ],
                          "files": [
                            {
                              "name": "scope.pdf",
                              "url": "https://example.com/scope.pdf",
                              "type": "application/pdf",
                              "size": "123456"
                            }
                          ],
                          "createdAt": "2026-01-01T10:30:22.000Z",
                          "updatedAt": "2026-01-01T10:30:22.000Z"
                        },
                        {
                          "_id": "671c2f0d9f4e2b0099999999",
                          "title": "IT Equipment Supply",
                          "description": "Supply of laptops and accessories",
                          "category": "IT",
                          "contractRelationship": "standalone",
                          "status": "pending_approval",
                          "createdAt": "2026-02-01T09:10:00.000Z",
                          "updatedAt": "2026-02-01T09:10:00.000Z"
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/contracts/me": {
      "get": {
        "summary": "List my contracts",
        "description": "Returns contracts created by the authenticated user in their company.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "status",
            "schema": {
              "type": "string",
              "enum": [
                "draft",
                "pending_approval",
                "active",
                "completed",
                "suspended",
                "expired",
                "terminated"
              ]
            },
            "description": "Filter by contract status"
          },
          {
            "in": "query",
            "name": "category",
            "schema": {
              "type": "string"
            },
            "description": "Filter by contract category"
          },
          {
            "in": "query",
            "name": "date",
            "schema": {
              "type": "string",
              "format": "date"
            },
            "description": "Return contracts having startDate \u003E= date (ISO 8601)"
          },
          {
            "in": "query",
            "name": "limit",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 10
            },
            "description": "Page size"
          },
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            },
            "description": "Page number"
          }
        ],
        "responses": {
          "200": {
            "description": "Contracts fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContractList"
                },
                "examples": {
                  "list": {
                    "value": {
                      "status": 200,
                      "message": "Contracts fetched successfully",
                      "data": [
                        {
                          "_id": "671c2f0d9f4e2b0012345678",
                          "title": "Bridge Inspection",
                          "description": "Routine inspection of municipal bridges",
                          "category": "Infrastructure",
                          "contractRelationship": "standalone",
                          "status": "active",
                          "deliverables": [
                            {
                              "name": "Initial Report",
                              "dueDate": "2026-02-15T00:00:00.000Z"
                            }
                          ],
                          "files": [
                            {
                              "name": "scope.pdf",
                              "url": "https://example.com/scope.pdf",
                              "type": "application/pdf",
                              "size": "123456"
                            }
                          ],
                          "createdAt": "2026-01-01T10:30:22.000Z",
                          "updatedAt": "2026-01-01T10:30:22.000Z"
                        },
                        {
                          "_id": "671c2f0d9f4e2b0099999999",
                          "title": "IT Equipment Supply",
                          "description": "Supply of laptops and accessories",
                          "category": "IT",
                          "contractRelationship": "standalone",
                          "status": "pending_approval",
                          "createdAt": "2026-02-01T09:10:00.000Z",
                          "updatedAt": "2026-02-01T09:10:00.000Z"
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/contracts/{contractId}": {
      "get": {
        "summary": "Get a contract by ID",
        "description": "Returns a single contract by its ID within the authenticated user's company.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "contractId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "Contract ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Contract fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContract"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/contracts/stats": {
      "get": {
        "summary": "Get contract statistics",
        "description": "Returns aggregate counts of contracts for the authenticated user's company.",
        "tags": [
          "Contract"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "responses": {
          "200": {
            "description": "Contract stats fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContractStats"
                },
                "examples": {
                  "stats": {
                    "value": {
                      "status": 200,
                      "message": "Contract stats fetched successfully",
                      "data": {
                        "all": 42,
                        "draft": 8,
                        "pending_approval": 6,
                        "active": 18,
                        "completed": 6,
                        "suspended": 2,
                        "expired": 1,
                        "terminated": 1
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/projects/stats": {
      "get": {
        "summary": "Get project statistics",
        "description": "Returns aggregate counts of projects for the authenticated user's company.",
        "tags": [
          "Project"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "responses": {
          "200": {
            "description": "Project stats fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseProjectStats"
                },
                "examples": {
                  "stats": {
                    "value": {
                      "status": 200,
                      "message": "Project stats fetched successfully",
                      "data": {
                        "all": 42,
                        "active": 18,
                        "completed": 20,
                        "cancelled": 4
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/projects/{projectId}": {
      "get": {
        "summary": "Get a project by ID",
        "description": "Returns a single project belonging to the authenticated user's company.",
        "tags": [
          "Project"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "projectId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The project ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Project fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseProject"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "404": {
            "description": "Project not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/projects/{projectId}/contracts": {
      "get": {
        "summary": "List contracts linked to a project",
        "description": "Returns contracts linked to the specified project within the authenticated user's company.",
        "tags": [
          "Project"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "view_only",
          "approvals",
          "company_admin",
          "contract_manager",
          "procurement"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "projectId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The project ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Project contracts fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseContractList"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "404": {
            "description": "Project not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    },
    "/projects/{projectId}/complete": {
      "patch": {
        "summary": "Mark project as complete",
        "description": "Updates project status to `completed`.",
        "tags": [
          "Project"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "x-roles": [
          "procurement",
          "contract_manager"
        ],
        "parameters": [
          {
            "in": "path",
            "name": "projectId",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "The project ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Project marked as complete successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ApiResponseProject"
                }
              }
            }
          },
          "401": {
            "description": "Unauthenticated user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthenticatedError"
                }
              }
            }
          },
          "403": {
            "description": "Forbidden – user lacks required role",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthorizeError"
                }
              }
            }
          },
          "404": {
            "description": "Project not found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFoundError"
                }
              }
            }
          },
          "500": {
            "description": "Server error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        }
      }
    }
  },
  "tags": [
    {
      "name": "Project",
      "description": "API endpoint for managing project"
    },
    {
      "name": "Contract",
      "description": "API endpoint for managing contract"
    }
  ]
}
