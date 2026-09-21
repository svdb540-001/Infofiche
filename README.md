# Infofiche Brandweer Zone Kempen

Een volledig statische webapp om operationele infofiches op te maken, lokaal te bewaren en af te drukken of als PDF op te slaan. Er is geen databank, account of server nodig.

## Functies

- invoervelden volgens de aangeleverde blanco infofiche;
- live A4-afdrukvoorbeeld;
- optionele liggende bijlage met maximaal vier kaarten of foto's;
- automatisch lokaal opslaan in de browser;
- afdrukken en bewaren als PDF via het afdrukvenster;
- locatie rechtstreeks openen in Google Maps en een kaartafdruk toevoegen;
- geschikt voor GitHub Pages.

## Publiceren op GitHub Pages

1. Maak op GitHub een nieuwe repository, bijvoorbeeld `infofiche`.
2. Upload alle bestanden en de map `assets` uit deze map naar de hoofdmap van de repository.
3. Open in GitHub **Settings > Pages**.
4. Kies bij **Build and deployment** voor **Deploy from a branch**.
5. Selecteer branch **main**, map **/(root)** en klik op **Save**.
6. Na enkele minuten verschijnt de publieke link bovenaan dezelfde pagina.

## PDF maken

Klik in de app op **PDF maken / afdrukken**. Kies in het afdrukvenster als printer **Opslaan als PDF** of **Microsoft Print to PDF**. Zet indien beschikbaar **Achtergrondafbeeldingen** aan en marges op **Geen**. De afdrukweergave is ook geschikt voor kleinere browservensters.

## Google Maps-kaart toevoegen

1. Vul bij **Locatie activiteit** een volledig adres in.
2. Klik op **Open locatie in Google Maps**.
3. Stel in Google Maps de gewenste kaart, route of satellietweergave in.
4. Maak met het Knipprogramma van Windows een schermafbeelding.
5. Klik in de app op **Voeg kaartafdruk toe** en selecteer die afbeelding.

De kaart verschijnt op een afzonderlijke liggende bijlagepagina. Een automatische Google Maps-afbeelding zonder tussenstap is niet opgenomen, omdat de officiële Static Maps-dienst een API-sleutel met facturatie vereist.

## Privacy

Alle gegevens en afbeeldingen blijven in de browser van het gebruikte toestel. De app verstuurt niets naar een server. Met **Nieuwe fiche** worden de lokaal bewaarde gegevens gewist.
