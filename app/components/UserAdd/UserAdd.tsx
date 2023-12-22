import { addUser } from "@/app/util/functions";
import { AddUserState } from "@/app/util/types";
import { AddIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@chakra-ui/react";
import { useMemo, useReducer } from "react";
import CustomSelect from "../CustomSelect/CustomSelect";
import styles from "./UserAdd.module.css";

type UserAddProps = {
  toast: any;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  mutate: Function;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

type AddUserAction = {
  field?: "name" | "email" | "cfUsername" | "role" | "clan";
  value: string;
  type: "UPDATE" | "RESET";
};

function reduceAddUser(
  state: AddUserState,
  action: AddUserAction
): AddUserState {
  switch (action.type) {
    case "UPDATE":
      return { ...state, [action.field!]: action.value };
    case "RESET":
      return {
        name: "",
        email: "",
        cfUsername: "",
        role: "Member",
        clan: "none",
      };
    default:
      return state;
  }
}

function UserAdd({
  toast,
  isLoading,
  setIsLoading,
  mutate,
  setPage,
}: UserAddProps) {
  const selectOptions = useMemo(
    () => [
      { value: "Admin", label: "Admin" },
      { value: "Leader", label: "Leader" },
      { value: "CoLeader", label: "CoLeader" },
      { value: "Elder", label: "Elder" },
      { value: "Member", label: "Member" },
      { value: "Guest", label: "Guest" },
    ],
    []
  );

  const selectClan = useMemo(
    () => [
      { value: "none", label: "none" },
      { value: "BW", label: "Blue Wizards" },
      { value: "YB", label: "Yellow Barbarians" },
      { value: "RG", label: "Red Giants" },
      { value: "PP", label: "Purple Pekkas" },
    ],
    []
  );

  const defaultUser: AddUserState = {
    name: "",
    email: "",
    cfUsername: "",
    role: "Member",
    clan: "none",
  };

  const [newUser, dispatchUser] = useReducer(reduceAddUser, defaultUser);

  return (
    <div className={styles.main}>
      <div>
        <div>
          <Input
            variant={"default"}
            placeholder="Name"
            size="sm"
            onChange={(e) =>
              dispatchUser({
                type: "UPDATE",
                field: "name",
                value: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Input
            variant={"default"}
            placeholder="Email"
            size="sm"
            onChange={(e) =>
              dispatchUser({
                type: "UPDATE",
                field: "email",
                value: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div>
        <Input
          variant={"default"}
          placeholder="Username"
          size="sm"
          onChange={(e) => {
            const input = e.target.value;

            dispatchUser({
              field: "cfUsername",
              value: input,
              type: "UPDATE",
            });
          }}
        />
      </div>

      <div>
        <CustomSelect
          selectOptions={selectOptions}
          option={newUser.role}
          setOption={(val) => {
            dispatchUser({
              type: "UPDATE",
              field: "role",
              value: val as string,
            });
          }}
        />
      </div>

      <div>
        <CustomSelect
          selectOptions={selectClan}
          option={newUser.clan}
          setOption={(val) => {
            dispatchUser({
              type: "UPDATE",
              field: "clan",
              value: val as string,
            });
          }}
        />
      </div>

      <div>
        <div>
          <IconButton
            isLoading={isLoading}
            aria-label="Add"
            icon={<AddIcon />}
            width="64px"
            height="48px"
            borderRadius="16px"
            onClick={async () => {
              setIsLoading(true);
              setPage(1);
              await addUser(newUser, mutate, toast);
              mutate();
              dispatchUser({ type: "RESET", value: "" });
              setIsLoading(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UserAdd;
