gcloud services enable aiplatform.googleapis.com --project monks-plexus
gcloud services enable apigateway.googleapis.com --project monks-plexus
gcloud services enable cloudbuild.googleapis.com --project monks-plexus
gcloud services enable cloudfunctions.googleapis.com --project monks-plexus
#gcloud services enable cloudtasks.googleapis.com --project monks-plexus
#gcloud services enable discoveryengine.googleapis.com --project monks-plexus
gcloud services enable drive.googleapis.com --project monks-plexus
gcloud services enable docs.googleapis.com --project monks-plexus
gcloud services enable firestore.googleapis.com --project monks-plexus
gcloud services enable run.googleapis.com --project monks-plexus
gcloud services enable secretmanager.googleapis.com --project monks-plexus
gcloud services enable servicecontrol.googleapis.com --project monks-plexus
gcloud services enable sheets.googleapis.com --project monks-plexus
gcloud services enable storage.googleapis.com --project monks-plexus
gcloud storage buckets create gs://monks-plexus --location=europe-west1 --project monks-plexus
gcloud firestore databases create --database=plexus --location=europe-west1 --type=firestore-native --project=monks-plexus
PROJECT_NUMBER=$(gcloud projects describe monks-plexus --format='value(projectNumber)' --quiet)
gcloud projects add-iam-policy-binding monks-plexus --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com --role=roles/cloudbuild.builds.builder
gcloud iam service-accounts create plexus --display-name="plexus" --project monks-plexus
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/cloudfunctions.invoker"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/run.invoker"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/aiplatform.user"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/storage.admin"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/datastore.user"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/drive.file"
gcloud services enable sqladmin.googleapis.com --project monks-plexus
gcloud sql instances create plexus --database-version=POSTGRES_15 --tier=db-f1-micro --region=europe-west1 --root-password=postgres --project monks-plexus --database-flags=cloudsql.iam_authentication=on
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/cloudsql.client"
gcloud projects add-iam-policy-binding monks-plexus --member="serviceAccount:plexus@monks-plexus.iam.gserviceaccount.com" --role="roles/cloudsql.instanceUser"
gcloud sql users create plexus@monks-plexus.iam --instance=plexus --type=cloud_iam_service_account --project monks-plexus
echo "CREATE EXTENSION IF NOT EXISTS vector; GRANT ALL PRIVILEGES ON DATABASE postgres TO \"plexus@monks-plexus.iam\"; GRANT ALL ON SCHEMA public TO \"plexus@monks-plexus.iam\";" | gcloud sql connect plexus --user=postgres --project monks-plexus --quiet
