import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { useGetAllEtudiantsQuery } from "../../store/api/apiSlice";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="table-checkbox"
      />
    );
  }
);

const EtudiantPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useGetAllEtudiantsQuery({
    page,
    limit: pageSize,
    search,
  });

  const actions = [
    {
      name: "view",
      icon: "ph:eye",
      doit: (id) => {
        navigate(`/etudiant/${id}`);
      },
    },
    {
      name: "edit",
      icon: "ph:pencil-line",
      doit: (id) => {
        navigate(`/edit-etudiant/${id}`);
      },
    },
    {
      name: "delete",
      icon: "ph:trash",
      doit: (id) => {
        console.log(`Delete student ${id}`);
      },
    },
  ];

  const COLUMNS = [
    {
      Header: "ID",
      accessor: "id",
      Cell: ({ value }) => <span className="text-sm">{value}</span>,
    },
    {
      Header: "Student",
      accessor: "nom",
      Cell: ({ row }) => (
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="flex-none">
            <Avatar
              src={row.original.documentPath || "/default-avatar.png"}
              alt={`${row.original.nom} ${row.original.prenom}`}
            />
          </div>
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize block">
              {`${row.original.nom} ${row.original.prenom}`}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-light mt-[1px] block lowercase">
              {row.original.email || "example@gmail.com"}
            </span>
          </div>
        </div>
      ),
    },
    {
      Header: "Level",
      accessor: "niveau",
      Cell: ({ value }) => <div>{value}</div>,
    },
    {
      Header: "Institution",
      accessor: "etablissement",
      Cell: ({ value }) => <div>{value}</div>,
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      Cell: ({ value }) => (
        <div>{new Date(value).toLocaleDateString()}</div>
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="text-center">
          <Dropdown
            classMenuItems="right-0 w-[140px] top-[110%]"
            label={
              <span className="text-lg text-center h-7 w-7 inline-flex justify-center items-center bg-transparent hover:bg-gray-200 transition-all duration-200 rounded-full leading-none">
                <Icon icon="heroicons-outline:dots-horizontal" />
              </span>
            }
          >
            <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white">
              {actions.map((item, i) => (
                <div key={i} onClick={() => item.doit(row.original.id)}>
                  <div
                    className={`
                      hover:bg-indigo-500/10 hover:text-indigo-500 
                      w-full border-b border-b-gray-400 border-opacity-10 px-4 py-2 text-sm last:mb-0 cursor-pointer 
                      first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse`}
                  >
                    <span className="text-base">
                      <Icon icon={item.icon} />
                    </span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const tableData = useMemo(() => (data?.data || []), [data]);

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: tablePage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize: setTablePageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  React.useEffect(() => {
    setPage(pageIndex + 1);
  }, [pageIndex]);

  React.useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card noborder>
      <div className="md:flex pb-6 items-center">
        <h6 className="flex-1 md:mb-0 mb-3">Students</h6>
        <div className="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse md:space-y-0 space-y-5">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <Button
            icon="ph:plus"
            text="Add Student"
            className="btn-primary font-normal min-h-[42px]"
            iconClass="text-lg"
            onClick={() => navigate("/add-etudiant")}
          />
        </div>
      </div>
      <div className="overflow-x-auto -mx-5">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table
              className="min-w-full divide-y divide-gray-100 table-fixed dark:divide-gray-700"
              {...getTableProps()}
            >
              <thead className="bg-gray-100 dark:bg-gray-700">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        scope="col"
                        className="table-th"
                      >
                        <div className="flex items-center justify-between">
                          {column.render("Header")}
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <Icon icon="ph:caret-up-fill" />
                              ) : (
                                <Icon icon="ph:caret-down-fill" />
                              )
                            ) : (
                              <Icon
                                icon="ri:expand-up-down-fill"
                                className="text-[15px] text-gray-400"
                              />
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                className="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:divide-gray-700"
                {...getTableBodyProps()}
              >
                {tablePage.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-200"
                    >
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="table-td">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="flex space-x-2 rtl:space-x-reverse items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Go
            </span>
            <input
              type="number"
              className="text-control py-2"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                gotoPage(pageNumber);
              }}
              style={{ width: "50px" }}
            />
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Page{" "}
            <span>
              {pageIndex + 1} of {data?.totalPages || 1}
            </span>
          </span>
        </div>
        <ul className="flex items-center space-x-3 rtl:space-x-reverse">
          <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
            <button
              className={`${
                !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <Icon icon="heroicons-outline:chevron-left" />
            </button>
          </li>
          {Array.from({ length: data?.totalPages || 1 }, (_, i) => (
            <li key={i}>
              <button
                className={`${
                  i === pageIndex
                    ? "bg-indigo-500 text-white font-medium"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-gray-900 font-normal"
                } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                onClick={() => gotoPage(i)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li className="text-xl leading-4 text-gray-900 dark:text-white rtl:rotate-180">
            <button
              className={`${
                !canNextPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <Icon icon="heroicons-outline:chevron-right" />
            </button>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default EtudiantPage;