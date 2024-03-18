import React, { useState, useRef, memo, useEffect } from "react";
import MarketIndex from "../../components/MarketIndex";
import filterIcon from "../../assets/newFilter.png";
import LeftNav from "../../components/LeftNav";
import RightNav from "../../components/RightNav";
import "../../styles.css";
import { TopNav } from "../../components/TopNav";
import { ErrorContainer } from "../../components/ErrorConsole";

function Orders() {
  // Error Message start

  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // Error Message end
  //order page
  const [columnVisibilityFnO, setcolumnVisibilityFnO] = useState({
    Action: true,
    "User Id": true,
    "Portfolio Name": true,
    "Leg Identifer": true,
    "Execute Market": true,
    Cancel: true,
    Exchange: true,
    "Exchange Symbol": true,
    Product: true,
    "Order Type": true,
    "Order ID": true,
    Time: true,
    Txn: true,
    Qty: true,
    "Filled Qty": true,
    "Pending Qty": true,
    "Exchange Qty": true,
    "Avg Price": true,
    Status: true,
    "LIMIT Price": true,
    "Trigger Price": true,
    "Order Failed": true,
    "User Alias": true,
    Remarks: true,
    Tag: true,
    UID: true,
  });
  const OrdersPageCols = [
    "Action",
    "User Id",
    "Portfolio Name",
    "Leg Identifer",
    "Execute Market",
    "Cancel",
    "Exchange",
    "Exchange Symbol",
    "Product",
    "Order Type",
    "Order ID",
    "Time",
    "Txn",
    "Qty",
    "Filled Qty",
    "Pending Qty",
    "Exchange Qty",
    "Avg Price",
    "Status",
    "LIMIT Price",
    "Trigger Price",
    "Order Failed",
    "User Alias",
    "Remarks",
    "Tag",
    "UID",
  ];

  //order page
  return (
    <div>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />

        <div className="middle-main-container">
          {/* <ErrorContainer
            msgs={[]}
          /> */}
          <TopNav
            pageCols={OrdersPageCols}
            colVis={columnVisibilityFnO}
            setcolVis={setcolumnVisibilityFnO}
          />
          <div className="tab-container">
            <div
              className="main-table"
              style={{ overflow: "auto", height: "92%" }}
              // ref={tableRef}
            >
              <table className="orderflowtable">
                <thead>
                  <tr>
                    <th style={{ display: "none" }}>
                      <input
                        type="checkbox"
                        name="first-col-head"
                        id="first-col-head"
                      />
                    </th>
                    {/*  */}
                    {columnVisibilityFnO["Action"] && (
                      <th colspan="2">
                        <div>
                          <small>Action</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-32px",
                            }}
                            onClick={() => {
                              setShowSelectBox((prev) => !prev);
                            }}
                          />
                        </div>
                        {/* {showSelectBox && (
																	<div>
																		<select
																			type="text"
																			value={enabledFilter}
																			onChange={handleEnabledFilterChange}
																			style={{
																				padding: '0.1rem 0.3rem',
																				width: '100%',
																				margin: '1px',
																			}}
																		>
																			<option value="">All</option>
																			<option value="checked">checked</option>
																			<option value="unchecked">unchecked</option>
																		</select>
																	</div>
																)} */}
                      </th>
                    )}
                    {columnVisibilityFnO["User Id"] && (
                      <th>
                        <div>
                          <small>User Id</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-30px",
                            }}
                            onClick={() => {
                              setShowSearchId((prev) => !prev);
                            }}
                          />
                        </div>
                        {/* {showSearchId && (
																	<div className="Filter-popup">
																		<form
																			id="filter-form-user"
																			className="Filter-inputs-container"
																		>
																			<ul>
																				<li>
																					<input
																						type="checkbox"
																						style={{ width: '12px' }}
																						checked={selectAllForId}
																						onChange={
																							handleSelectAllForUserId
																						}
																					/>
																					Select all
																				</li>
																				<li>
																					{uniqueDatauserId.map(
																						(userId, index) => {
																							return (
																								<div
																									key={index}
																									className="filter-inputs"
																								>
																									<input
																										type="checkbox"
																										style={{
																											width: '15px',
																										}}
																										checked={userIdSelected.includes(
																											userId.toLowerCase()
																										)}
																										onChange={() =>
																											handleCheckboxChangeUser(
																												userId.toLowerCase()
																											)
																										}
																									/>
																									<label>
																										{userId}
																									</label>
																								</div>
																							);
																						}
																					)}
																				</li>
																			</ul>
																		</form>
																		<div className="filter-popup-footer">
																			<button onClick={handleOkClick}>ok</button>
																			<button
																				onClick={() =>
																					setShowSearchId((prev) => !prev)
																				}
																			>
																				Cancel
																			</button>
																		</div>
																	</div>
																)} */}
                      </th>
                    )}

                    {/* console.log( checked); */}
                    {columnVisibilityFnO["Portfolio Name"] && (
                      <th>
                        <div>
                          <small>Portfolio Name</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-12px",
                            }}
                            onClick={() => {
                              setShowSearchfyersclientId((prev) => !prev);
                            }}
                          />
                        </div>
                        {/* {showSearchfyersclientId && (
																	<div className="Filter-popup">
																		<form
																			id="filter-form-user"
																			className="Filter-inputs-container"
																		>
																			<ul>
																				<li>
																					<input
																						type="checkbox"
																						style={{ width: '12px' }}
																						checked={
																							selectAllForfyersclientId
																						}
																						onChange={
																							handleSelectAllForFyersClientId
																						}
																					/>
																					Select all
																				</li>
																				<li>
																					{uniqueDatafyersclientId.map(
																						(fyersclientId, index) => {
																							return (
																								<div
																									key={index}
																									className="filter-inputs"
																								>
																									<input
																										type="checkbox"
																										style={{
																											width: '15px',
																										}}
																										checked={fyersclientIdSelected.includes(
																											fyersclientId.toLowerCase()
																										)}
																										onChange={() =>
																											handleCheckboxChangefyersclient(
																												fyersclientId.toLowerCase()
																											)
																										}
																									/>
																									<label>
																										{fyersclientId}
																									</label>
																								</div>
																							);
																						}
																					)}
																				</li>
																			</ul>
																		</form>
																		<div className="filter-popup-footer">
																			<button onClick={handleOkClick}>ok</button>
																			<button
																				onClick={() =>
																					setShowSearchfyersclientId(
																						(prev) => !prev
																					)
																				}
																			>
																				Cancel
																			</button>
																		</div>
																	</div>
																)} */}
                      </th>
                    )}

                    {columnVisibilityFnO["Leg Identifer"] && (
                      <th>
                        {/* <div>
							<small>MTM (All)</small>
							<div className="icon-container">
								<CiFilter
									className="filter_icon"
									onClick={() => {
										setShowSearchMTM((prev) => !prev);
									}}
								/>
							</div>
						</div> */}
                        <div>
                          <small>Leg Identifer</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-15px",
                            }}
                            onClick={() => {
                              setShowSearchMTM((prev) => !prev);
                            }}
                          />
                        </div>
                        {/* {showSearchMTM && (
																	<div className="Filter-popup">
																		<form
																			id="filter-form-mtm"
																			className="Filter-inputs-container"
																		>
																			<ul>
																				<li>
																					<input
																						type="checkbox"
																						style={{ width: '12px' }}
																						checked={selectAllMTM}
																						onChange={handleSelectAllForMTM}
																					/>
																					Select all
																				</li>
																				<li>
																					{uniqueDataMTM.map((mtm, index) => (
																						<div
																							key={index}
																							className="filter-inputs"
																						>
																							<input
																								type="checkbox"
																								style={{
																									width: '12px',
																								}}
																								checked={mtmSelected.includes(
																									mtm
																								)}
																								onChange={() =>
																									handleCheckboxChangeMTM(
																										mtm
																									)
																								}
																							/>
																							<label>{mtm}</label>
																						</div>
																					))}
																				</li>
																			</ul>
																		</form>
																		<div className="filter-popup-footer">
																			<button onClick={handleOkClick}>ok</button>
																			<button
																				onClick={() =>
																					setShowSearchMTM((prev) => !prev)
																				}
																			>
																				Cancel
																			</button>
																		</div>
																	</div>
																)} */}
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["Execute Market"] && (
                      <th>
                        <div>
                          <small>Execute Market</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-15px",
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Cancel"] && (
                      <th>
                        <div>
                          <small>Cancel</small>
                        </div>
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["Exchange"] && (
                      <th>
                        <div>
                          <small>Exchange</small>
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Exchange Symbol"] && (
                      <th>
                        <div>
                          <small>Exchange Symbol</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={() => {
                              setShowSearchMTM((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Product"] && (
                      <th>
                        <div>
                          <small>Product</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-30px",
                            }}
                            onClick={() => {
                              setShowSearchMTM((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Order Type"] && (
                      <th>
                        <div>
                          <small>Order Type</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-20px",
                            }}
                            onClick={() => {
                              setShowSearchMTM((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Order ID"] && (
                      <th>
                        <div>
                          <small>Order ID</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-25px",
                            }}
                            onClick={() => {
                              setShowSearchMTM((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}

                    {columnVisibilityFnO["Time"] && (
                      <th>
                        <div>
                          <small>Time</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-40px",
                            }}
                            onClick={() => {
                              setShowSearchMTM((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Txn"] && (
                      <th>
                        <div>
                          <small>Txn</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-45px",
                            }}
                            onClick={() => {
                              setShowSearchMTM((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Qty"] && (
                      <th>
                        <div>
                          <small>Qty</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-42px",
                            }}
                            onClick={() => {
                              setShowSearchSqOffTime((prev) => !prev);
                            }}
                          />
                        </div>
                        {/* {showSearchSqOffTime && (
																	<div className="Filter-popup">
																		<form
																			id="filter-form-sqOffTime"
																			className="Filter-inputs-container"
																		>
																			<ul>
																				<li>
																					<input
																						type="checkbox"
																						style={{ width: '12px' }}
																						checked={selectAllSqOffTime}
																						onChange={
																							handleSelectAllForSqOffTime
																						}
																					/>
																					Select all
																				</li>
																				<li>
																					{uniqueDataSqOffTime.map(
																						(sqOffTime, index) => (
																							<div
																								key={index}
																								className="filter-inputs"
																							>
																								<input
																									type="checkbox"
																									style={{
																										width: '12px',
																									}}
																									checked={sqOffTimeSelected.includes(
																										sqOffTime.toLowerCase()
																									)}
																									onChange={() =>
																										handleCheckboxChangeSqOffTime(
																											sqOffTime.toLowerCase()
																										)
																									}
																								/>
																								<label>
																									{sqOffTime}
																								</label>
																							</div>
																						)
																					)}
																				</li>
																			</ul>
																		</form>
																		<div className="filter-popup-footer">
																			<button onClick={handleOkClick}>ok</button>
																			<button
																				onClick={() =>
																					setShowSearchSqOffTime(
																						(prev) => !prev
																					)
																				}
																			>
																				Cancel
																			</button>
																		</div>
																	</div>
																)} */}
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["Filled Qty"] && (
                      <th>
                        <div>
                          <small>Filled Qty</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-25px",
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["Pending Qty"] && (
                      <th>
                        <div>
                          <small>Pending Qty</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-20px",
                            }}
                          />
                        </div>
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["Exchange Qty"] && (
                      <th>
                        <div>
                          <small>Exchange Qty</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-15px",
                            }}
                            onClick={() => {
                              setShowSearchMaxProfit((prev) => !prev);
                            }}
                          />
                        </div>
                        {/* {showSearchMaxProfit && (
																	<div className="Filter-popup">
																		<form
																			id="filter-form"
																			className="Filter-inputs-container"
																		>
																			<ul>
																				<li>
																					<input
																						type="checkbox"
																						style={{ width: '12px' }}
																						checked={selectAllMaxProfit}
																						onChange={
																							handleSelectAllForMaxProfit
																						}
																					/>
																					Select all
																				</li>
																				<li>
																					{uniqueDataMaxProfit.map(
																						(maxProfit, index) => (
																							<div
																								key={index}
																								className="filter-inputs"
																							>
																								<input
																									type="checkbox"
																									style={{
																										width: '12px',
																									}}
																									checked={maxProfitSelected.includes(
																										maxProfit
																									)}
																									onChange={() =>
																										handleCheckBoxChangeForMaxProfit(
																											maxProfit
																										)
																									}
																								/>
																								<label>
																									{maxProfit}
																								</label>
																							</div>
																						)
																					)}
																				</li>
																			</ul>
																		</form>
																		<div className="filter-popup-footer">
																			<button onClick={handleOkClick}>ok</button>
																			<button
																				onClick={() =>
																					setShowSearchMaxProfit(
																						(prev) => !prev
																					)
																				}
																			>
																				Cancel
																			</button>
																		</div>
																	</div>
																)} */}
                      </th>
                    )}

                    {columnVisibilityFnO["Avg Price"] && (
                      <th>
                        <div>
                          <small>Avg Price</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-25px",
                            }}
                            onClick={() => {
                              setShowSearchMaxLoss((prev) => !prev);
                            }}
                          />
                        </div>

                        {/* {showSearchMaxLoss && (
																	<div className="Filter-popup">
																		<form
																			id="filter-form"
																			className="Filter-inputs-container"
																		>
																			<ul>
																				<li>
																					<input
																						type="checkbox"
																						style={{ width: '12px' }}
																						checked={selectAllMaxLoss}
																						onChange={
																							handleSelectAllForMaxLoss
																						}
																					/>
																					Select all
																				</li>
																				<li>
																					{uniqueDataMaxLoss.map(
																						(maxLoss, index) => (
																							<div
																								key={index}
																								className="filter-inputs"
																							>
																								<input
																									type="checkbox"
																									style={{
																										width: '12px',
																									}}
																									checked={maxLossSelected.includes(
																										maxLoss
																									)}
																									onChange={() =>
																										handleCheckBoxChangeForMaxLoss(
																											maxLoss
																										)
																									}
																								/>
																								<label>{maxLoss}</label>
																							</div>
																						)
																					)}
																				</li>
																			</ul>
																		</form>
																		<div className="filter-popup-footer">
																			<button onClick={handleOkClick}>ok</button>
																			<button
																				onClick={() =>
																					setShowSearchMaxLoss(
																						(prev) => !prev
																					)
																				}
																			>
																				Cancel
																			</button>
																		</div>
																	</div>
																)} */}
                      </th>
                    )}

                    {/*  */}

                    {/*  */}
                    {columnVisibilityFnO["Status"] && (
                      <th>
                        <div>
                          <small>Status</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-35px",
                            }}
                            onClick={() => {
                              setShowSearchQtyByExposure((prev) => !prev);
                            }}
                          />
                        </div>
                        {/* {showSearchQtyByExposure && (
																	<div className="Filter-popup">
																		<form
																			id="filter-form-qty-by-exposure"
																			className="Filter-inputs-container"
																		>
																			<ul>
																				<li>
																					<input
																						type="checkbox"
																						style={{ width: '12px' }}
																						checked={selectAllQtyByExposure}
																						onChange={
																							handleSelectAllForQtyByExposure
																						}
																					/>
																					Select all
																				</li>
																				<li>
																					{uniqueDataQtyByExposure.map(
																						(qtyByExposure, index) => (
																							<div
																								key={index}
																								className="filter-inputs"
																							>
																								<input
																									type="checkbox"
																									style={{
																										width: '12px',
																									}}
																									checked={qtyByExposureSelected.includes(
																										qtyByExposure.toString()
																									)}
																									onChange={() =>
																										handleCheckboxChangeQtyByExposure(
																											qtyByExposure.toString()
																										)
																									}
																								/>
																								<label>
																									{qtyByExposure}
																								</label>
																							</div>
																						)
																					)}
																				</li>
																			</ul>
																		</form>
																		<div className="filter-popup-footer">
																			<button onClick={handleOkClick}>ok</button>
																			<button
																				onClick={() =>
																					setShowSearchQtyByExposure(
																						(prev) => !prev
																					)
																				}
																			>
																				Cancel
																			</button>
																		</div>
																	</div>
																)} */}
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["LIMIT Price"] && (
                      <th>
                        <div>
                          <small>LIMIT Price</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-18px",
                            }}
                          />
                        </div>
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["Trigger Price"] && (
                      <th>
                        <div>
                          <small>Trigger Price</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-20px",
                            }}
                            onClick={() => {
                              setShowSearchMaxLossPerTrade((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["Order Failed"] && (
                      <th>
                        <div>
                          <small>Order Failed</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-20px",
                            }}
                            onClick={() => {
                              setShowSearchMaxOpenTrades((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["User Alias"] && (
                      <th>
                        <div>
                          <small>User Alias</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-25px",
                            }}
                            onClick={() => {
                              setShowSearchQtyMultiplier((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}

                    {/*  */}
                    {columnVisibilityFnO["Remarks"] && (
                      <th>
                        <div>
                          <small>Remarks</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-30px",
                            }}
                            onClick={() => {
                              setShowSearchMobile((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {columnVisibilityFnO["Tag"] && (
                      <th>
                        <div>
                          <small>Tag</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-45px",
                            }}
                          />
                        </div>
                      </th>
                    )}
                    {/*  */}
                    {columnVisibilityFnO["UID"] && (
                      <th>
                        <div>
                          <small>UID</small>
                          <img
                            src={filterIcon}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginLeft: "-45px",
                            }}
                            onClick={() => {
                              setShowSearchEmail((prev) => !prev);
                            }}
                          />
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="tabletbody">
                  <tr>
                    {columnVisibilityFnO["Action"] && (
                      <td style={{ width: "15%" }} colSpan={2}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["User Id"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Portfolio Name"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Leg Identifer"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Execute Market"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Cancel"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Exchange"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Exchange Symbol"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Product"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Order Type"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Order ID"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Time"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Txn"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Qty"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Filled Qty"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Pending Qty"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Exchange Qty"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Avg Price"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Status"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["LIMIT Price"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Trigger Price"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Order Failed"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["User Alias"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Remarks"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["Tag"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                    {columnVisibilityFnO["UID"] && (
                      <td style={{ width: "15%" }}>
                        <input type="text" />
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="button2 button3" id="collapse">
              Collapse
            </button>
          </div>

          <ErrorContainer msgs={msgs} handleClearLogs={handleClearLogs} />
        </div>
        <RightNav />
      </div>
    </div>
  );
}

export default Orders;
