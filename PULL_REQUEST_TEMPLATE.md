### I forbindelse med release av nye pakker, har du husket / må du huske:

Som en del av utvikling skal man også kunne rutinene rundt [håndtering av egne pakker](https://github.spvdev.no/sfo/digitalbank-doc/blob/master/egne_npm_pakker.md#versjonering-og-publisering-av-egne-npm-pakker).

#### Pre-release
- [ ] En person fra hver gruppe har fått PR for endringene
- [ ] PR-tittel merket med formatet "<Leankit Card ID(s)> - Beskrivelse", eks. "SB123 - La til ny funksjon"
- [ ] Lenke til relevante PRs i andre repos
- [ ] Oppdatere README ved endringer av API
- [ ] Oppdatere CHANGELOG, format:

  ```md
  # x.y.z
  > DD.MM.YY
  * Beskrivelse av endring, gjerne med ikon og type endring i feit tekst, se punkt under
  * :tada: **Enhancement**: Beskrivelse av endring

  ```
- [ ] Oppdatere pakker som denne pakken bruker (deps og devDeps)
- [ ] Skrevet tester for ny kode

#### Post-release
- [ ] Legge til referanse til pakken i  [pakkeoversikten](https://github.spvdev.no/sfo/digitalbank-doc/blob/master/pakkeoversikt.md) hvis dette er en ny pakke
- [ ] Informere andre på #digitalbank-sync om release
- [ ] Pushe tags
