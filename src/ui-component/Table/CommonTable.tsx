import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
    Box,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Pagination,
    IconButton,
    TextField,
    SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import MyPopover from "../MyPopover";
import MyIconButton from "../MyIconButton";
import Typo from "../Typo";
import { Typography as MuiTypography } from "@mui/material";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { allSearchParams, debounce, paramsToString } from "@/utils/commonTable";

// Types
export type TableCellType = "text" | "action" | string;

export interface TableCellDef<Row = any> {
    headName: string;
    key?: keyof Row | string;
    searchKey?: string;
    type?: TableCellType;
    enableSort?: boolean;
    freezeAtStart?: boolean;
    freezeAtLast?: boolean;
    highlight?: boolean;
    typoStyleHead?: any;
    typoStyleRow?: any;
    enableCopying?: boolean;
    sortKey?: string;
    enableSearch?: boolean;
    customBody?: (row: Row) => ReactNode;
    customData?: (row: Row) => ReactNode;
    allActions?: (row: Row) => ReactNode;
}

export interface CommonTableProps<Row = any> {
    tableStructure?: TableCellDef<Row>[];
    data?: Row[];
    loading?: boolean;
    defaultSize?: number;
    defaultPage?: number;
    removeSerialNo?: boolean;
    removeSearch?: boolean;
    enableSort?: boolean;
    defalutSearchKey?: string;
    defalutSortKey?: string;
    defalutSortType?: "asc" | "desc";
    handleBackend?: boolean;
    totalDataCount?: number;
    onBackClick?: () => void;
    tableName?: ReactNode | string;
    buttonsAtTableNameLevel?: ReactNode;
    reFetch?: () => void;
    isFetching?: boolean;
    isStale?: boolean;
    buttonsAtSeachLevel?: ReactNode;
    children?: ReactNode;
    topHeading?: ReactNode
}

// Styles
const tableCellStyle = {
    minWidth: "40px",
    maxWidth: "200px",
    height: "63px",
};

const headTypoStyle = {
    fontSize: "0.85rem",
    //   fontFamily: "Inter",
    fontWeight: 500,
    textAlign: "left" as const,
    textTransform: "capitalize" as const,
    color: "rgba(101, 112, 129, 1)",
};

const bodyTypoStyle = {
    color: "#4a4a4a",
    //   fontFamily: "Inter",
    fontSize: "0.8rem",
    fontWeight: 450,
    textAlign: "left" as const,
};

const freezeAtStart = {
    position: "sticky" as const,
    left: 0,
    zIndex: 10,
    backgroundColor: "#f8fafc",
    outline: "1px solid #e2e8f0",
    boxSizing: "border-box" as const,
};

const freezeAtLast = {
    position: "sticky" as const,
    right: 0,
    zIndex: 10,
    backgroundColor: "#f8fafc",
    outline: "1px solid #e2e8f0",
    boxSizing: "border-box" as const,
};

const highlight = {
    backgroundColor: "#f8fafc",
    outline: "1px solid #e2e8f0",
};

// URL param helpers adapted for Next.js


const useSetSearchParams = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    return {
        searchParams,
        setSearchParams: (paramsObj: Record<string, any>) => {
            const paramsStr = paramsToString(paramsObj);
            router.replace(`${pathname}?${paramsStr}`);
        },
    };
};



function CommonTable<Row = any>({
    tableStructure = [],
    data = [],
    loading = false,
    defaultSize = 10,
    defaultPage = 1,
    ...props
}: CommonTableProps<Row>) {
    const [actualData, setActualData] = useState<Row[]>([]);
    const [view, setView] = useState<Row[] | null>(null);
    const { searchParams, setSearchParams } = useSetSearchParams();

    // Initialize URL params
    useLayoutEffect(() => {
        let temp = allSearchParams(searchParams) || {} as Record<string, any>;

        const pageAsNumber = Number(temp?.page);
        const pageAsSize = Number(temp?.limit);

        if (!temp?.limit || pageAsSize < 5 || isNaN(pageAsSize)) temp = { ...temp, limit: defaultSize || 10 };
        if (!temp?.page || pageAsNumber < 1 || isNaN(pageAsNumber)) temp["page"] = defaultPage;

        if ((props as any)?.defalutSearchKey && !(props as any)?.removeSearch) temp["searchKey"] = (props as any)?.defalutSearchKey;
        if ((props as any)?.defalutSortKey && (props as any)?.enableSort) temp["sortKey"] = (props as any)?.defalutSortKey;
        if ((props as any)?.defalutSortType && (props as any)?.enableSort) temp["sortType"] = (props as any)?.defalutSortType;

        if (Object.keys(temp)?.length) setSearchParams(temp);
    }, []);

    // Local searching/sorting
    useLayoutEffect(() => {
        if (data?.length && !(props as any)?.handleBackend) {
            if (actualData?.length === 0) {
                setActualData(data);
            }

            const temp = allSearchParams(searchParams) as Record<string, any> | null;
            if (temp && Object.keys(temp)?.length) {
                if (temp?.page > 0 && temp?.limit) {
                    const tempData = JSON.parse(JSON.stringify(data)) as Row[];
                    let searchResult: Row[] = [];
                    let sortResult: Row[] = [];

                    const searchKey = temp?.searchKey || (props as any)?.defalutSearchKey;
                    if (searchKey && temp?.searchValue && !(props as any)?.removeSearch) {
                        searchResult = tempData.filter((row: any) => {
                            if (row?.[searchKey]) {
                                return String(row?.[searchKey])?.toLowerCase()?.includes(temp?.searchValue);
                            }
                            return false;
                        });
                    }

                    if (temp?.sortKey && temp?.sortType && (props as any)?.enableSort) {
                        const dataToSort = searchResult?.length ? searchResult : tempData;
                        sortResult = dataToSort.sort((a: any, b: any) => {
                            const dataA = a?.[temp?.sortKey];
                            const dataB = b?.[temp?.sortKey];

                            const isNumber = !isNaN(Number(dataA));
                            const isDate = new Date(dataA);

                            if (dataA) {
                                if (temp?.sortType === "asc") {
                                    if (isDate !== ("Invalid Date" as any)) return (new Date(dataA) as any) - (new Date(dataB) as any);
                                    if (isNumber) return (dataA as number) - (dataB as number);
                                    return String(dataA).localeCompare(String(dataB));
                                } else {
                                    if (isDate !== ("Invalid Date" as any)) return (new Date(dataB) as any) - (new Date(dataA) as any);
                                    if (isNumber) return (dataB as number) - (dataA as number);
                                    return String(dataB).localeCompare(String(dataA));
                                }
                            }
                            return 0;
                        });
                    } else {
                        sortResult = searchResult?.length ? searchResult : tempData;
                    }
                    setActualData(sortResult);
                }
            }
        }
    }, [
        searchParams?.get("searchValue"),
        searchParams?.get("searchKey"),
        searchParams?.get("sortType"),
        searchParams?.get("sortKey"),
        data,
    ]);

    // Pagination view slice
    useEffect(() => {
        if (data?.length && !(props as any)?.handleBackend) {
            const temp = allSearchParams(searchParams) as Record<string, any> | null;
            if (temp && Object.keys(temp)?.length) {
                const from = (Number(temp?.page) - 1) * Number(temp?.limit);
                let slicedData: Row[] = [];
                if (searchParams?.get("searchValue")) {
                    slicedData = actualData?.length ? actualData.slice(from, from + Number(temp?.limit)) : [];
                } else {
                    slicedData = actualData.slice(from, from + Number(temp?.limit));
                }
                setView(slicedData);
            }
        }
    }, [searchParams?.get("page"), searchParams?.get("limit"), actualData]);

    // Keep page in range; support backend mode
    useEffect(() => {
        if (data?.length || (props as any)?.totalDataCount) {
            const temp = allSearchParams(searchParams) as Record<string, any> | null;
            if (temp?.page && temp?.limit) {
                const totalPages = (props as any)?.handleBackend
                    ? Math.ceil(((props as any)?.totalDataCount || 0) / Number(temp?.limit))
                    : Math.ceil((data?.length || 0) / Number(temp?.limit));
                if (temp?.page > totalPages || temp?.page < 0) {
                    setSearchParams({ ...temp, page: 1 });
                }
            }
        }
        if ((props as any)?.handleBackend) setView(data);
    }, [data, (props as any)?.totalDataCount]);

    // Render
    return (
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1.5, }}>
            <Box sx={{ display: "flex", alignItems: "center", my:'10px'}}>
                {(props as any)?.onBackClick && (
                    <MyIconButton onClick={(props as any)?.onBackClick} tooltip="Back" sx={{}} color="primary">
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: "18px" }} />
                    </MyIconButton>
                )}
                {(props as any)?.topHeading && (
                    <Box sx={{ ml: "0" }}>{(props as any)?.topHeading}</Box>
                )}
                <Box sx={{ ml: "auto" }}>{(props as any)?.buttonsAtTableNameLevel}</Box>
            </Box>

            <Box>{(props as any)?.children}</Box>

            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", boxShadow: "rgba(0, 0, 0, 0.05) 0px 4px 8px", padding: '24px' }}>
                <Box sx={{ display: "flex", mb: 2.5 }}>
                    {!((props as any)?.removeSearch) && (
                        <SearchArea defalutSearchKey={(props as any)?.defalutSearchKey} tableStructure={tableStructure as TableCellDef[]} />
                    )}
                    {(props as any)?.tableName && (
                        <Box sx={{ ml: 0 }}>{(props as any)?.tableName}</Box>
                    )}
                    <Box sx={{ ml: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {(props as any)?.reFetch && (
                            <MyIconButton
                                loading={(props as any)?.isFetching}
                                color={(props as any)?.isStale ? "orange" : "primary"}
                                onClick={(props as any)?.reFetch}
                                sx={{ mr: 1 }}
                                tooltip={(props as any).isFetching ? "Refreshing..." : "Click to Refresh"}
                            >
                                <RefreshIcon fontSize="small" />
                            </MyIconButton>
                        )}
                        {(props as any)?.buttonsAtSeachLevel}
                    </Box>
                </Box>

                {loading ? (
                    <Table stickyHeader>
                        <TableHead sx={{ height: "90px" }}>
                            <SkeletonRow rows={1} length={((props as any)?.removeSerialNo ? tableStructure?.length : (tableStructure?.length || 0) + 1) || 0} />
                        </TableHead>
                        <TableBody>
                            <SkeletonRow length={((props as any)?.removeSerialNo ? tableStructure?.length : (tableStructure?.length || 0) + 1) || 0} />
                        </TableBody>
                    </Table>
                ) : (
                    <>
                        {view?.length ? (
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ backgroundColor: "rgba(250, 250, 250, 1)", maxHeight: '42px' }}>
                                        <HeadComp
                                            tableStructure={tableStructure as TableCellDef[]}
                                            removeSerialNo={(props as any)?.removeSerialNo}
                                            defalutSortKey={(props as any)?.defalutSortKey}
                                            enableSort={(props as any)?.enableSort}
                                        />
                                    </TableHead>
                                    <TableBody>
                                        {view?.map((rowData, i) => (
                                            <BodyComp
                                                key={(rowData as any)?._id || i}
                                                rowData={rowData}
                                                i={i}
                                                removeSerialNo={(props as any)?.removeSerialNo}
                                                tableStructure={tableStructure as TableCellDef[]}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ width: "100%", height: "30dvh", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px" }}>
                                <Typography sx={{ color: "black", fontSize: "20px", fontWeight: 700 }}>No Data</Typography>
                            </Box>
                        )}
                        {actualData?.length || ((props as any)?.handleBackend && (props as any)?.totalDataCount) ? (
                            <Box sx={{ m: 2, mb: 1, display: "flex", justifyContent: "flex-end", gap: 1.5, alignItems: "center" }}>
                                <RowPerPage />
                                <TablePagination dataLength={(props as any)?.totalDataCount || actualData?.length} />
                            </Box>
                        ) : null}
                    </>
                )}
            </Paper>
        </Box>
    );
}

export default CommonTable;

const RowPerPage = React.memo(() => {
    const { searchParams, setSearchParams } = useSetSearchParams();
    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography component={"span"} variant="subtitle1" sx={{ color: "#616161", fontWeight: "400" }}>
                Rows per page :
            </Typography>
            <Select
                size="small"
                value={Number(searchParams?.get("limit")) || 10}
                onChange={(e: SelectChangeEvent<number | string>) => {
                    const temp = allSearchParams(searchParams) || {} as Record<string, any>;
                    setSearchParams({ ...temp, limit: Number(e.target.value), page: 1 });
                }}
                variant="outlined"
                sx={{
                    "& .MuiSelect-select": { padding: "4px 9px", backgroundColor: "#f9f9f9", border: "none", borderRadius: "8px" },
                    "& .MuiOutlinedInput-notchedOutline": { border: "0px" },
                }}
            >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
            </Select>
        </Box>
    );
});

const TablePagination = React.memo(({ dataLength }: { dataLength: number }) => {
    const { searchParams, setSearchParams } = useSetSearchParams();
    const limit = Number(searchParams?.get("limit")) || 10;
    const count = Math.max(1, Math.ceil((dataLength || 0) / limit));
    const page = Number(searchParams?.get("page")) || 1;
    return (
        <Pagination
            size="small"
            count={count}
            page={page}
            sx={{ "& .MuiPaginationItem-page.Mui-selected": { backgroundColor: "#0F60FF", color: "#FFF" } }}
            onChange={(_e, p) => {
                const currPage = Number(searchParams?.get("page")) || 1;
                if (currPage !== p) {
                    const temp = allSearchParams(searchParams) || {} as Record<string, any>;
                    setSearchParams({ ...temp, page: p });
                }
            }}
            variant="outlined"
            shape="rounded"
        />
    );
});

const HeadComp = React.memo(({ tableStructure, ...props }: { tableStructure: TableCellDef[]; removeSerialNo?: boolean; defalutSortKey?: string; enableSort?: boolean }) => {
    return (
        <TableRow sx={{ alignItems: "left", borderBottom: "1.5px dashed #fff" }}>
            {!props?.removeSerialNo && (
                <TableCell sx={{ width: "50px" }}>
                    <MuiTypography sx={{ ...headTypoStyle }}>S.No</MuiTypography>
                </TableCell>
            )}
            {tableStructure?.map((cellData, i) => {
                const freezeStyle = cellData?.freezeAtStart ? freezeAtStart : cellData?.freezeAtLast ? freezeAtLast : {};
                const highlightStyle = cellData?.highlight ? highlight : {};
                const isAction = cellData?.type === "action";
                return (
                    <TableCell key={i} sx={isAction ? { width: "100px", ...freezeStyle, ...highlightStyle, ...tableCellStyle, height: "42px" } : { ...tableCellStyle, ...freezeStyle, ...highlightStyle, height: "42px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: isAction ? "center" : "flex-start" }}>
                            <MuiTypography sx={{ ...headTypoStyle, ...(cellData as any).typoStyleHead, textAlign: isAction ? "center" : "left" }}>{cellData?.headName as any}</MuiTypography>
                            {props?.enableSort && cellData?.enableSort ? (
                                <SortComp defalutSortKey={props?.defalutSortKey} sortKey={cellData?.sortKey || (cellData?.key as string)} />
                            ) : null}
                        </Box>
                    </TableCell>
                );
            })}
        </TableRow>
    );
});

const BodyComp = React.memo(({ rowData, i, tableStructure, ...props }: { rowData: any; i: number; tableStructure: TableCellDef[]; removeSerialNo?: boolean }) => {
    const { searchParams } = useSetSearchParams();
    return (
        <TableRow sx={{
            alignItems: "left", border: 'none', borderBottom: "1.5px dashed #e2e8f0",
            borderImage: "repeating-linear-gradient(90deg, #e2e8f0 0 6px, transparent 6px 12px) 1",
            paddingBottom: "8px",
            "&:hover ": { backgroundColor: "#f8fafc" },
        }}>
            {!props?.removeSerialNo && (
                <TableCell sx={{ width: "50px" }}>
                    <MuiTypography sx={{ ...bodyTypoStyle }}>
                        {((Number(searchParams?.get("page") || 1) - 1) * Number(searchParams?.get("limit") || 10)) + i + 1}
                    </MuiTypography>
                </TableCell>
            )}
            {tableStructure?.map((cellData, idx) => {
                const freezeStyle = cellData?.freezeAtStart ? freezeAtStart : cellData?.freezeAtLast ? freezeAtLast : {};
                const highlightStyle = cellData?.highlight ? highlight : {};
                if (cellData?.type === "action" && cellData?.allActions) {
                    return (
                        <TableCell key={idx} align="center" sx={{ width: "100px", ...freezeStyle, ...highlightStyle, }}>
                            <ActionPopover>{cellData?.allActions(rowData)}</ActionPopover>
                        </TableCell>
                    );
                }
                if (cellData?.customBody) {
                    return (
                        <TableCell key={idx} sx={cellData?.type === "action" ? { width: "100px", ...freezeStyle, ...highlightStyle } : {}}>
                            {cellData?.customBody(rowData)}
                        </TableCell>
                    );
                }
                return (
                    <TableCell key={idx} sx={{ ...tableCellStyle, ...freezeStyle, ...highlightStyle }}>
                        <MuiTypography sx={{ ...bodyTypoStyle, ...(cellData as any).typoStyleRow }}>
                            {(cellData?.customData ? cellData?.customData(rowData) : (cellData?.key ? (rowData as any)?.[cellData?.key as string] || "" : "")) as any}
                        </MuiTypography>
                    </TableCell>
                );
            })}
        </TableRow>
    );
});

const ActionPopover = React.memo(({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    return (
        <>
            <IconButton size="small" onClick={(e) => { setAnchorEl(e.currentTarget); setOpen(true); }}>
                <MoreHorizIcon fontSize="small" />
            </IconButton>
            <MyPopover
                open={open}
                anchorEl={anchorEl}
                onClose={() => { setOpen(false); setAnchorEl(null); }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{}}
            >
                {children}
            </MyPopover>
        </>
    );
});

export const SkeletonRow = React.memo(({ length = 7, rows = 5 }: { length?: number; rows?: number }) => (
    <>
        {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
                {Array.from({ length }).map((__, index) => (
                    <TableCell key={index}>
                        <Skeleton variant="text" width={100} />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </>
));

const SearchArea = React.memo(({ tableStructure, ...props }: { tableStructure: TableCellDef[]; defalutSearchKey?: string; removeSearch?: boolean }) => {
    const { searchParams, setSearchParams } = useSetSearchParams();
    const [searchval, setSearchVal] = useState<string | null>(searchParams?.get("searchValue") || "");

    const setSearchDebounce = useCallback(
        debounce((value: string | null, previousParams: Record<string, any>) => {
            setSearchParams(value ? { ...previousParams, page: 1, searchValue: value } : { ...previousParams });
        }, 500),
        []
    );

    useEffect(() => {
        const previousParams = allSearchParams(searchParams) || {} as Record<string, any>;
        if (searchval) {
            setSearchDebounce(searchval, previousParams);
        } else if (searchval == null && (previousParams as any).searchValue) {
            delete (previousParams as any).searchValue;
            setSearchDebounce("", previousParams);
            setSearchVal("");
        }
    }, [searchval]);

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Select
                size="small"
                value={searchParams?.get("searchKey") || (props?.defalutSearchKey as any) || ""}
                variant="outlined"
                sx={{ minWidth: "30px", borderColor: "#fff", ml: 0 }}
                onChange={(e) => {
                    const temp = allSearchParams(searchParams) || {} as Record<string, any>;
                    setSearchParams({ ...temp, searchKey: e.target.value });
                }}
            >
                {tableStructure.map((search, i) =>
                    (search as any)?.enableSearch ? (
                        <MenuItem key={i} value={(search as any)?.searchKey || (search as any)?.key as any}>
                            {(search as any)?.headName}
                        </MenuItem>
                    ) : null
                )}
            </Select>
            <TextField
                size="small"
                placeholder="Seach Here"
                value={searchval ?? ""}
                onChange={(e) => {
                    const value = e?.target?.value;
                    setSearchVal(value ? value.toLowerCase() : null);
                }}
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ margin: "0px 10px 0px 0px", color: "#9b9b9b" }} />,
                    style: { backgroundColor: "#fff" },
                }}
            />
        </Box>
    );
});

const SortComp = React.memo(({ defalutSortKey, sortKey }: { defalutSortKey?: string; sortKey: string }) => {
    const { searchParams, setSearchParams } = useSetSearchParams();
    const currSortKey = searchParams?.get("sortKey") === sortKey;
    const handleSortType = () => {
        const temp = allSearchParams(searchParams) || {} as Record<string, any>;
        setSearchParams({ ...temp, sortKey, sortType: temp.sortType === "asc" ? "desc" : "asc" });
    };
    return currSortKey ? (
        searchParams?.get("sortType") === "asc" ? (
            <KeyboardArrowUpRoundedIcon fontSize="small" sx={{ ml: 0.3, cursor: "pointer", color: currSortKey ? "#000" : "#9b9b9b" }} onClick={handleSortType} />
        ) : (
            <KeyboardArrowDownRoundedIcon fontSize="small" sx={{ ml: 0.3, cursor: "pointer", color: searchParams.get("sortKey") === sortKey ? "#000" : "#9b9b9b" }} onClick={handleSortType} />
        )
    ) : (
        <KeyboardArrowUpRoundedIcon fontSize="small" sx={{ ml: 0.3, cursor: "pointer", color: "#9b9b9b" }} onClick={handleSortType} />
    );
});


