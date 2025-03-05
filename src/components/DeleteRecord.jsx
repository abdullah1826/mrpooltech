import React from "react";
import { get, ref, remove } from "firebase/database";
import { toast } from "react-toastify";

const DeleteRecord = ({ delid, db, setdelid, updateLinks, setModal }) => {
  const handleDelete = async () => {
    try {
      console.log("Deleting record with ID:", delid);

      // ✅ Get the projectId from the Maintenance record
      const maintenanceSnapshot = await get(ref(db, `Maintenance/${delid}`));
      if (!maintenanceSnapshot.exists()) {
        toast.error("Maintenance record not found!");
        return;
      }

      const maintenanceData = maintenanceSnapshot.val();
      console.log("Maintenance Record:", maintenanceData);

      let projectId = maintenanceData.projectId; // Default projectId from Maintenance
      let deletePromises = []; // Array to hold delete operations

      let workerType = maintenanceData.workerType;
      console.log("Worker Type:", workerType);

      let workertable = "";

      if (workerType === "permanent") {
        workertable = "workers";
      } else if (workerType === "other") {
        workertable = "otherWorkers";
      } else if (workerType === "visitor") {
        workertable = "visitingWorkers";
      } else {
        console.error("Invalid workerType:", workerType);
        toast.error("Invalid worker type!");
        return; // Stop execution if workerType is invalid
      }

      console.log("Worker Table:", workertable);

      // ✅ Fetch all workers based on workerType
      let workersSnapshot;
      try {
        workersSnapshot = await get(ref(db, workertable));
        console.log("Workers Data:", workersSnapshot.val());
      } catch (error) {
        console.error("Error fetching workers:", error);
        toast.error("Failed to fetch workers.");
        return;
      }

      if (workersSnapshot.exists()) {
        const workersData = workersSnapshot.val();
        console.log("Workers Data:", workersData);

        // 🔄 Loop through each worker
        for (const workerId in workersData) {
          const worker = workersData[workerId];

          if (worker.assignedSites) {
            console.log(`Worker ${workerId} Assigned Sites:`, worker.assignedSites);

            for (const siteId in worker.assignedSites) {
              const site = worker.assignedSites[siteId];

              console.log(`Checking site:`, site);

              // 🔎 Check if this site matches the deleted maintenance record
              if (site?.siteUid === delid) {
                console.log(`Deleting assigned site: ${siteId} from worker: ${workerId}`);

                // ✅ Correct database path usage
                deletePromises.push(
                  remove(ref(db, `${workertable}/${workerId}/assignedSites/${siteId}`))
                );

                projectId = site?.projectId;
                console.log("Found and Deleted Assigned Site. Project ID:", projectId);
              }
            }
          }
        }
      } else {
        console.log("No workers data found!");
      }

      // ✅ Execute all delete operations before proceeding
      await Promise.all(deletePromises);

      // ✅ Ensure projectId is valid before proceeding
      if (!projectId) {
        toast.error("Project ID not found!");
        return;
      }

      // ✅ Delete the Maintenance Record
      await remove(ref(db, `Maintenance/${delid}`));
      console.log(`Deleted Maintenance record with ID: ${delid}`);

      // ✅ Reset state and show success message
      setdelid("");
      updateLinks();
      setModal(false);
      toast.success("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div>
      <button onClick={handleDelete} className="btn btn-danger">
        Delete Record
      </button>
    </div>
  );
};

export default DeleteRecord;
